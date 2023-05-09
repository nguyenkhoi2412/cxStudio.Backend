import asyncHandler from "express-async-handler";
import { ROLE } from "../constant/enumRoles.js";
import User from "../models/user.model.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import { TEMPLATES } from "../shared/templates.js";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import response from "../utils/response.helper.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";
import bcrypt from "bcrypt";
import UserService from "../services/user.js";

const expired = 60 * 60; // 1 hours

export default {
  //#region AUTHENTICATION
  FIND_BY_USER: asyncHandler(async (req, res) => {
    // get user by username
    UserService.findByUser(req, res, req.body.username).then((user) => {
      res.status(statusCodes.OK).json({
        code: statusCodes.OK,
        ok: true,
        message: "User is existing in system",
        rs: [],
      });
    });
  }),
  //validate function to retrieve user by username & password
  VALIDATE_USER: asyncHandler(async (req, res) => {
    var { username, password } = req.params;

    UserService.verifyPassword(req, res, username, password).then((user) => {
      // check user isLock?
      if (user.isLock) {
        return res.status(statusCodes.OK).json({
          code: statusCodes.LOCKED,
          ok: false,
          message: "Authentication failed. Account has been locked",
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

      const dataJwtToken = {
        username: userResponse.username,
        role: userResponse.role,
        verified_token: !userResponse.oneTimePassword,
      };

      // create access token
      const jwtToken = jwt.sign(
        { data: JSON.stringify(dataJwtToken) },
        process.env.JWT_TOKEN,
        {
          expiresIn: dataJwtToken.verified_token
            ? parseInt(process.env.TOKEN_EXPIRESIN) * expired // 6 hours
            : 900, // 15 min use for login
        }
      );

      // create refresh token
      const jwtRefreshToken = jwt.sign(
        { data: JSON.stringify(dataJwtToken) },
        process.env.JWT_REFRESH_TOKEN,
        {
          expiresIn: parseInt(process.env.TOKEN_EXPIRESIN) * expired * 6, // 24 hours
        }
      );

      // remove secure data
      delete userResponse.password;
      delete userResponse.secret_2fa;

      // sessionHandler.setCookie(res, "access_token", "abcdrf#@$@#$");
      response.DEFAULT(res, null, {
        verified_token: !user.oneTimePassword,
        currentUser: userResponse,
        access_token: jwtToken,
        refresh_token: jwtRefreshToken,
      });
    });
  }),
  //saveUser function to save new user
  REGISTER_USER: asyncHandler(async (req, res) => {
    // Create an instance of model SomeModel
    const { username, password, role, oneTimePassword, phone, detailInfos } =
      req.body;

    const usernameDecrypt = encryptHelper.rsa.decrypt(username);

    // get user by username
    User.findOne()
      .findByUsername(usernameDecrypt)
      .exec((err, user) => {
        if (err) {
          return res.status(statusCodes.UNAUTHORIZED).json({
            code: statusCodes.UNAUTHORIZED,
            ok: false,
            message: err.message,
          });
        }

        if (user) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: usernameDecrypt + " is existing in the system.",
            rs: [],
          });
        }

        var userId = helpersExtension.uuidv4();
        var userData = new User({
          _id: userId,
          username: usernameDecrypt,
          password: password,
          role: helpersExtension.checkIsNotNull(role) ? role : ROLE.USER.name,
          email: usernameDecrypt,
          phone: helpersExtension.checkIsNotNull(phone) ? phone : 0,
          isLock: false,
          oneTimePassword: helpersExtension.checkIsNotNull(oneTimePassword)
            ? oneTimePassword
            : false,
          secret_2fa: encryptHelper.aes.encrypt(
            encryptHelper.totp.generateKey(usernameDecrypt)
          ),
          detailInfos: {
            firstname: helpersExtension.checkIsNotNull(detailInfos.firstname)
              ? detailInfos.firstname
              : "",
            lastname: helpersExtension.checkIsNotNull(detailInfos.lastname)
              ? detailInfos.lastname
              : "",
            avatarPath: helpersExtension.checkIsNotNull(detailInfos.avatarPath)
              ? detailInfos.avatarPath
              : "",
          },
        });

        // Save the new model instance, passing a callback
        userData.save(function (err, result) {
          response.DEFAULT(res, err, {
            _id: result._id,
            username: result.username,
            password: result.password,
            role: result.role,
            secret_2fa: result.secret_2fa,
            firstname: result.detailInfos.firstname,
            lastname: result.detailInfos.lastname,
            fullname:
              result.detailInfos.firstname + " " + result.detailInfos.lastname,
          });
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
    UserService.verifyPassword(req, res, currentUsername, currentPassword).then(
      (user) => {
        // check account need to change/reset password existing?
        UserService.findByUser(req, res, usernameResetPassword).then(
          (userReset) => {
            // decrypt & bcrypt password before update
            let newPasswordHash = encryptHelper.rsa.decrypt(newPassword);
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
              }).exec((err, rs) => {
                if (!err && rs) {
                  User.find()
                    .findByFilter(filter)
                    .exec((error, rsData) => {
                      response.DEFAULT(res, err, {});
                    });
                } else {
                  response.DEFAULT(res, err, rs);
                }
              });
            });
          }
        );
      }
    );
  }),
  RECOVERY_PASSWORD: asyncHandler(async (req, res) => {
    const { username } = req.params;

    // get user info by username
    UserService.findByUser(req, res, username).then((user) => {
      if (user.isLock) {
        return res.status(statusCodes.OK).json({
          code: statusCodes.LOCKED,
          ok: false,
          message: "Account has been locked",
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
  //#region SECURE 2FA
  // validate token from 2FA
  VALIDATE_SECURE_2FA: asyncHandler(async (req, res) => {
    var { id, code } = req.body;

    // get user by id
    User.findOne()
      .findById(id)
      .exec((err, user) => {
        if (err) {
          return res.status(statusCodes.UNAUTHORIZED).json({
            code: statusCodes.UNAUTHORIZED,
            ok: false,
            message: err.message,
          });
        }

        if (!user) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "User not found",
            rs: [],
          });
        }

        // validate code from 2fa
        const verified = encryptHelper.totp.verified(
          encryptHelper.aes.decrypt(user.secret_2fa),
          code
        );

        //* verified success
        if (verified) {
          let userResponse = { ...user.toJSON() };
          const dataJwtToken = {
            username: userResponse.username,
            role: userResponse.role,
            verified_token: verified,
          };

          // create new access token
          const jwtToken = jwt.sign(
            { data: JSON.stringify(dataJwtToken) },
            process.env.JWT_TOKEN,
            {
              expiresIn: parseInt(process.env.TOKEN_EXPIRESIN) * expired, // 6 hours
            }
          );

          res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: verified,
            message: "ok",
            rs: {
              access_token: jwtToken,
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
      });
  }),

  // generate token 2fa
  SECURE_2FA_GENERATE_TOKEN: asyncHandler(async (req, res) => {
    var id = req.params.id;

    // get user by id
    User.findOne()
      .findById(id)
      .exec((err, user) => {
        if (err) {
          return res.status(statusCodes.UNAUTHORIZED).json({
            code: statusCodes.UNAUTHORIZED,
            ok: false,
            message: err.message,
          });
        }

        if (!user) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "User not found",
            rs: [],
          });
        }

        // generateToken from 2fa
        const secret = encryptHelper.aes.decrypt(user.secret_2fa);
        const token_2fa = encryptHelper.totp.generateToken(secret);
        const yourBand = `cxStudio 🌠`;
        const htmlTemplate = TEMPLATES.EMAIL.VERIFICATION_CODE;

        transportHelper.mail.smtp({
          to: user.email,
          subject: "Verify your login",
          text: token_2fa,
          html: htmlTemplate
            .replace(
              `{{user.givenname}}`,
              user.detailInfos.firstname + " " + user.detailInfos.lastname
            )
            .replace(`{{OTPCode}}`, token_2fa)
            .replace(/{{yourBand}}/gi, yourBand),
        });

        res.status(statusCodes.OK).json({
          code: statusCodes.OK,
          ok: true,
          message: "Code is sent to email: " + user.email,
        });
      });
  }),
  //#endregion
};
