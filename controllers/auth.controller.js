import asyncHandler from "express-async-handler";
import { ROLE } from "../constant/role.js";
import { ACCOUNT_STATUS } from "../constant/enumAccountStatus.js";
import User from "../models/user.model.js";
import { crossCutting } from "../utils/crossCutting.js";
import { TEMPLATES } from "../shared/templates.js";
import encrypt from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import response from "../utils/response.helper.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";
import bcrypt from "bcrypt";
import UserService from "../services/user.js";

const expired = 60 * 60; // 1 hours

export default {
  //#region AUTHENTICATION
  // FIND_BY_USER: asyncHandler(async (req, res) => {
  //   // get user by username
  //   UserService.findByUser(req.body.username).then((user) => {
  //     // if (!user) {
  //     //   return res.status(statusCodes.OK).json({
  //     //     code: statusCodes.OK,
  //     //     ok: true,
  //     //     message: "Not found!",
  //     //     rs: [],
  //     //   });
  //     // }
  //     if (user) {
  //       res.status(statusCodes.OK).json({
  //         code: statusCodes.OK,
  //         ok: true,
  //         message: "User is existing in system",
  //         rs: [],
  //       });
  //     }

  //   });
  // }),
  //validate function to retrieve user by username & password
  VALIDATE_USER: asyncHandler(async (req, res) => {
    var { username, password } = req.params;

    UserService.findByUser(username).then((user) => {
      // validate username/password
      if (crossCutting.check.isNull(user) || !user.verifyPassword(password)) {
        return res.status(statusCodes.OK).json({
          code: statusCodes.OK,
          ok: false,
          message: "Authentication failed. Incorrect username/password",
          rs: {},
        });
      }

      // check user status?
      if (user.status !== ACCOUNT_STATUS.ACTIVE.TEXT) {
        return res.status(statusCodes.OK).json({
          code: statusCodes.LOCKED,
          ok: false,
          message: "Authentication failed. " + ACCOUNT_STATUS[user.status].DESC,
          rs: {},
        });
      }

      let userResponse = {
        ...user.toJSON(),
        isAdmin: user.role === ROLE.ADMIN.name,
        isSupervisor: user.role === ROLE.SUPERVISOR.name,
        isUser: user.role === ROLE.USER.name,
        isVisitor: user.role === ROLE.VISITOR.name,
      };

      let jwt = UserService.jwtSignTokenForUser(userResponse);

      // remove secure data
      delete userResponse.password;
      delete userResponse.secret_2fa;

      // sessionHandler.setCookie(res, "access_token", "abcdrf#@$@#$");
      response.DEFAULT(res, null, {
        verified_token: !user.oneTimePassword,
        currentUser: userResponse,
        access_token: jwt.token,
        refresh_token: jwt.refreshToken,
      });
    });
  }),
  //saveUser function to save new user
  REGISTER_USER: asyncHandler(async (req, res) => {
    // Create an instance of model SomeModel
    const {
      username,
      password,
      role,
      status,
      oneTimePassword,
      phone,
      detailInfos,
    } = req.body;

    const usernameDecrypt = encrypt.rsa.decrypt(username);

    // get user by username
    User.findOne()
      .byUsername(usernameDecrypt)
      .then((user) => {
        if (user) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: usernameDecrypt + " is existing in the system.",
            rs: [],
          });
        }

        var userId = crossCutting.generate.uuidv4();
        var fName = detailInfos.firstName || "";
        var lName = detailInfos.lastName || "";
        var alias = detailInfos.aliasName || fName + " " + lName;

        var userData = new User({
          _id: userId,
          username: usernameDecrypt,
          password: password,
          role: role || ROLE.USER.name,
          status: status || ACCOUNT_STATUS.ACTIVE.TEXT,
          loginAttemptCount: 0,
          email: usernameDecrypt,
          phone: crossCutting.check.isNotNull(phone) ? phone : 0,
          oneTimePassword: crossCutting.check.isNotNull(oneTimePassword)
            ? oneTimePassword
            : false,
          secret_2fa: encrypt.aes.encrypt(encrypt.otplib.generateKey()),
          detailInfos: {
            firstName: fName,
            lastName: lName,
            aliasName: alias,
            showAlias: false,
            avatarPath: detailInfos.avatarPath || "",
            country: detailInfos.country || "",
          },
        });

        // Save the new model instance, passing a callback
        userData.save().then((result) => {
          response.DEFAULT(res, err, {
            _id: result._id,
            username: result.username,
            role: result.role,
            firstName: result.detailInfos.firstName,
            lastName: result.detailInfos.lastName,
            fullname:
              result.detailInfos.firstName + " " + result.detailInfos.lastName,
          });
        });
      })
      .catch((err) => {
        return res.status(statusCodes.OK).json({
          code: statusCodes.UNAUTHORIZED,
          ok: false,
          message: err.message,
        });
      });
  }),
  //change password
  CHANGE_PASSWORD: asyncHandler(async (req, res) => {
    // Create an instance of model SomeModel
    const {
      currentUsername,
      currentPassword,
      usernameResetPassword,
      newPassword,
    } = req.body;

    // get user by username
    UserService.findByUser(currentUsername).then((user) => {
      // check verify password
      if (!user.verifyPassword(currentPassword)) {
        return res.status(statusCodes.OK).json({
          code: statusCodes.OK,
          ok: false,
          message: "Authentication failed. Incorrect username/password",
          rs: {},
        });
      }

      // check account need to change/reset password existing?
      UserService.findByUser(req, res, usernameResetPassword).then(
        (userReset) => {
          // decrypt & bcrypt password before update
          let newPasswordHash = encrypt.rsa.decrypt(newPassword);
          bcrypt.hash(newPasswordHash, 10, function (err, hash) {
            if (err) {
              return next(err);
            }
            // update new password
            var newValueUpdate = {
              _id: userReset._id,
              password: hash,
              updated_at: new Date(),
            };

            var filter = { _id: newValueUpdate._id };
            var updateValues = { $set: newValueUpdate };

            // Save update
            User.findOneAndUpdate(filter, updateValues, {
              upsert: true,
              new: true,
              returnNewDocument: true,
            }).then((rs) => {
              if (rs) {
                User.find()
                  .byFilter(filter)
                  .then((rsData) => {
                    response.DEFAULT(res, err, {});
                  });
              } else {
                response.DEFAULT(res, err, rs);
              }
            });
          });
        }
      );
    });
  }),
  RECOVERY_PASSWORD: asyncHandler(async (req, res) => {
    const { username } = req.params;

    // get user info by username
    UserService.findByUser(req, res, username).then((user) => {
      if (user.status !== ACCOUNT_STATUS.ACTIVE.TEXT) {
        return res.status(statusCodes.OK).json({
          code: statusCodes.LOCKED,
          ok: false,
          message: "Authentication failed. " + ACCOUNT_STATUS[user.status].DESC,
          rs: {},
        });
      }

      let newPasswordHash = process.env.DEFAULT_PASSWORD || "7654321aA@";
      bcrypt.hash(newPasswordHash, 10, function (err, hash) {
        if (err) {
          return next(err);
        }

        // update new password
        var newValueUpdate = {
          _id: user._id,
          password: hash,
          updated_at: new Date(),
        };

        var filter = { _id: newValueUpdate._id };
        var updateValues = { $set: newValueUpdate };

        // Save update
        User.findOneAndUpdate(filter, updateValues, {
          upsert: true,
          new: true,
          returnNewDocument: true,
        }).exec((err, rs) => {
          if (!err && rs) {
            // sent mail recovery password
            const yourBand = `cxStudio 🌠`;
            const htmlTemplate = TEMPLATES.EMAIL.RECOVERY_PASSWORD;

            transportHelper.mail.smtp({
              to: user.email,
              subject: "Recovery password",
              text: newPasswordHash,
              html: htmlTemplate
                .replace(
                  `{{user.givenname}}`,
                  user.detailInfos.firstname + " " + user.detailInfos.lastname
                )
                .replace(`{{password}}`, newPasswordHash)
                .replace(/{{yourBand}}/gi, yourBand),
            });

            // response to client
            res.status(statusCodes.OK).json({
              code: statusCodes.OK,
              ok: true,
              message:
                "Your password has been reset, please check in your email " +
                user.email,
            });
          } else {
            response.DEFAULT(res, err, rs);
          }
        });
      });
    });
  }),
  // refreshtoken function to retrieve new token
  REFRESH_TOKEN: asyncHandler(async (req, res) => {
    const refreshToken = req.body.refresh_token;

    try {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN,
        (error, decoded) => {
          if (error) {
            return res.status(statusCodes.UNAUTHORIZED).send({
              code: statusCodes.UNAUTHORIZED,
              ok: false,
              message: "Unauthorized!",
            });
          }

          // create new access token
          const jwtToken = jwt.sign(
            { data: decoded.data },
            process.env.JWT_TOKEN,
            {
              expiresIn: parseInt(process.env.TOKEN_EXPIRESIN) * expired, // 6 hours
            }
          );

          res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: true,
            message: "ok",
            rs: {
              access_token: jwtToken,
            },
          });
        }
      );
    } catch (err) {
      res.status(403).json({
        code: 403,
        ok: false,
        message: err.message,
      });
    }
  }),
  //#endregion
  //#region AUTHENTICATION SOCIAL EXTERNAL
  SOCIAL: {
    GOOGLE: asyncHandler(async (req, res) => {
      // Create an instance of model SomeModel
      const {
        username,
        password,
        role,
        status,
        oneTimePassword,
        phone,
        detailInfos,
      } = encrypt.aes.decrypt(req.params.query);

      // get user by username
      User.findOne()
        .byUsername(username)
        .then((user) => {
          // if account is already in db
          if (user) {
            responseUserValidate(res, user);
          } else {
            // Register new account
            var userId = crossCutting.generate.uuidv4();
            var fName = detailInfos.firstName || "";
            var lName = detailInfos.lastName || "";
            var alias = detailInfos.aliasName || fName + " " + lName;

            var userData = new User({
              _id: userId,
              username: username,
              password: encrypt.rsa.encrypt(crossCutting.generate.password(8)),
              role: ROLE.USER.name,
              status: ACCOUNT_STATUS.ACTIVE.TEXT,
              loginAttemptCount: 0,
              email: username,
              phone: 0,
              oneTimePassword: false,
              secret_2fa: encrypt.aes.encrypt(encrypt.otplib.generateKey()),
              detailInfos: {
                firstName: fName,
                lastName: lName,
                aliasName: alias,
                showAlias: true,
                avatarPath: detailInfos.avatarPath || "",
                country: "",
              },
            });

            // Save the new model instance, passing a callback
            userData.save().then((rsUser) => {
              responseUserValidate(res, rsUser);
            });
          }
        })
        .catch((err) => {
          return res.status(statusCodes.OK).json({
            code: statusCodes.UNAUTHORIZED,
            ok: false,
            message: err.message,
          });
        });
    }),
  },
  //#endregion
  //#region SECURE 2FA
  // validate token from 2FA
  VALIDATE_SECURE_2FA: asyncHandler(async (req, res) => {
    var { id, code } = req.body;

    // get user by id
    User.findById(id)
      .then((user) => {
        if (!user) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "User not found",
            rs: [],
          });
        }

        // validate code from 2fa
        const verified = encrypt.otplib.verified(
          code,
          encrypt.aes.decrypt(user.secret_2fa)
        );

        //* verified success
        if (verified) {
          let userResponse = { ...user.toJSON() };
          let jwtResponse = UserService.jwtSignTokenForUser(userResponse);

          res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: verified,
            message: "ok",
            rs: {
              access_token: jwtResponse.token,
              verified_token: true,
            },
          });
        } else {
          res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "Your token is invalid or expires.",
            rs: [],
          });
        }
      })
      .catch((err) => {
        return res.status(statusCodes.UNAUTHORIZED).json({
          code: statusCodes.UNAUTHORIZED,
          ok: false,
          message: err,
        });
      });
  }),

  // generate token 2fa
  SECURE_2FA_GENERATE_TOKEN: asyncHandler(async (req, res) => {
    var id = req.params.id;

    // get user by id
    User.findById(id)
      .then((user) => {
        if (!user) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "User not found",
            rs: [],
          });
        }

        // generateToken from 2fa
        const secret = encrypt.aes.decrypt(user.secret_2fa);
        const otpAuth = encrypt.otplib.generateToken(user.username, secret);
        // const QRCodeImage = encrypt.otplib.generateQRCode(otpAuth);
        encrypt.otplib.generateQRCode(otpAuth).then((imageUrl) => {
          // const yourBand = `Community 🌠`;
          // const htmlTemplate = TEMPLATES.EMAIL.VERIFICATION_CODE;

          // transportHelper.mail.smtp({
          //   to: user.email,
          //   subject: "Verify your login",
          //   // text: QRCodeImage,
          //   html: htmlTemplate
          //     .replace(
          //       `{{user.givenname}}`,
          //       user.detailInfos.firstName + " " + user.detailInfos.lastName
          //     )
          //     .replace(`{{OTPCode}}`, imageUrl)
          //     .replace(/{{yourBand}}/gi, yourBand),
          // });

          res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: true,
            message: "Generate QRCode successful.",
            rs: {
              qrCode: imageUrl,
            },
          });
        });
      })
      .catch((err) => {
        return res.status(statusCodes.UNAUTHORIZED).json({
          code: statusCodes.UNAUTHORIZED,
          ok: false,
          message: err.message,
        });
      });
  }),
  //#endregion
};

//#region SUPPORT FOR RESPONSE
const responseUserValidate = (res, user) => {
  // check user status?
  if (user.status !== ACCOUNT_STATUS.ACTIVE.TEXT) {
    return res.status(statusCodes.OK).json({
      code: statusCodes.LOCKED,
      ok: false,
      message: "Authentication failed. " + ACCOUNT_STATUS[user.status].DESC,
      rs: {},
    });
  }

  let userResponse = {
    ...user.toJSON(),
    isAdmin: user.role === ROLE.ADMIN.name,
    isSupervisor: user.role === ROLE.SUPERVISOR.name,
    isUser: user.role === ROLE.USER.name,
    isVisitor: user.role === ROLE.VISITOR.name,
  };

  let jwtResponse = UserService.jwtSignTokenForUser(userResponse);

  // remove secure data
  delete userResponse.password;
  delete userResponse.secret_2fa;
  delete userResponse.oneTimePassword;

  response.DEFAULT(res, null, {
    verified_token: !user.oneTimePassword,
    currentUser: userResponse,
    access_token: jwtResponse.token,
    refresh_token: jwtResponse.refreshToken,
  });
};
//#endregion
