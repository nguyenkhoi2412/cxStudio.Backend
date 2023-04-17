import asyncHandler from "express-async-handler";
import sessionHandler from "../middleware/sessionHandler.js";
import { ROLE } from "../shared/enums.js";
import User from "../models/user.model.js";
import { extensionsHelper } from "../utils/extensionsHelper.js";
import { TEMPLATES } from "../shared/templates.js";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import response from "../utils/response.helper.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";

const expired = 60 * 60; // 1 hours

export default {
  //#region AUTHENTICATION
  FIND_BY_USER: asyncHandler(async (req, res) => {
    var username = encryptHelper.rsa.decrypt(req.body.username);
    // get user by username
    User.findOne()
      .findByUsername(username)
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
    var username = encryptHelper.rsa.decrypt(req.params.username);
    // get user by username
    User.findOne()
      .findByUsername(username)
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

        // verify password with crypto & bcrypt
        if (!user.verifyPassword(req.params.password)) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "Authentication failed. Incorrect password",
            rs: {},
          });
        }

        let userResponse = { ...user.toJSON() };
        const dataJwtToken = {
          ...userResponse,
          verified_token: !userResponse.oneTimePassword,
        };

        // create access token
        const jwtToken = jwt.sign(
          { data: JSON.stringify(dataJwtToken) },
          process.env.JWT_TOKEN,
          {
            expiresIn: dataJwtToken.verified_token
              ? parseInt(process.env.TOKEN_EXPIRESIN) * expired // 4 hours
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
        delete userResponse.oneTimePassword;
        delete userResponse.secret_2fa;

        // sessionHandler.setCookie(res, "access_token", "abcdrf#@$@#$");
        response.DEFAULT(res, err, {
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

    const findByUserName = encryptHelper.rsa.decrypt(req.body.username);

    // get user by username
    User.findOne()
      .findByUsername(findByUserName)
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
            message: findByUserName + " is existing in the system.",
            rs: [],
          });
        }

        var userData = new User({
          _id: extensionsHelper.uuidv4(),
          username: username,
          password: password,
          role: extensionsHelper.checkIsNotNull(role) ? role : ROLE.USER.name,
          email: username,
          phone: extensionsHelper.checkIsNotNull(phone) ? phone : 0,
          oneTimePassword: extensionsHelper.checkIsNotNull(oneTimePassword)
            ? oneTimePassword
            : false,
          secret_2fa: encryptHelper.aes.encrypt(
            encryptHelper.totp.generateKey()
          ),
          detailInfos: {
            firstname: extensionsHelper.checkIsNotNull(detailInfos.firstname)
              ? detailInfos.firstname
              : "",
            lastname: extensionsHelper.checkIsNotNull(detailInfos.lastname)
              ? detailInfos.lastname
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
              expiresIn: parseInt(process.env.TOKEN_EXPIRESIN) * expired, // 4 hours
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
    var { id, token } = req.body;

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

        // validate token from 2fa
        const verified = encryptHelper.totp.verified(
          encryptHelper.aes.decrypt(user.secret_2fa),
          token
        );

        //* verified success
        if (verified) {
          let userResponse = { ...user.toJSON() };
          const dataJwtToken = {
            ...userResponse,
            verified_token: verified,
          };

          // create new access token
          const jwtToken = jwt.sign(
            { data: JSON.stringify(dataJwtToken) },
            process.env.JWT_TOKEN,
            {
              expiresIn: parseInt(process.env.TOKEN_EXPIRESIN) * expired, // 4 hours
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

        const yourBand = `E-GO Stores 🌠`;
        const htmlTemplate = TEMPLATES.EMAIL.VERIFICATION_CODE;

        transportHelper.mail.smtp({
          to: user.email,
          subject: "Verify your login",
          text: token_2fa,
          html: htmlTemplate
            .replace(`{{user.givenname}}`, user.username)
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
