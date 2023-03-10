import asyncHandler from "express-async-handler";
import sessionHandler from "../middleware/sessionHandler.js";
import { ROLE } from "../shared/enums.js";
import User from "../models/user.model.js";
import { Helpers } from "../utils/helpers.js";
import { TEMPLATES } from "../shared/templates.js";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import jwt from "jsonwebtoken";

const expired = 60 * 60; // 1 hours

export default {
  //#region AUTHENTICATION
  //validate function to retrieve user by username & password
  VALIDATE_USER: asyncHandler(async (req, res) => {
    var username = encryptHelper.rsa.decrypt(req.body.username);
    // get user by username
    User.findOne()
      .findByUsername(username)
      .exec((err, user) => {
        if (err) {
          return res.status(401).json({
            code: 401,
            ok: false,
            message: err.message,
          });
        }

        if (!user) {
          return res.status(200).json({
            code: 200,
            ok: false,
            message: "User not found",
            rs: [],
          });
        }

        // verify password with crypto & bcrypt
        if (!user.verifyPassword(req.body.password)) {
          return res.status(200).json({
            code: 200,
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

        res.status(200).json({
          code: 200,
          ok: true,
          message: "ok",
          rs: {
            verified_token: !user.oneTimePassword,
            currentUser: userResponse,
            access_token: jwtToken,
            refresh_token: jwtRefreshToken,
          },
        });
      });
  }),
  //saveUser function to save new user
  REGISTER_USER: asyncHandler(async (req, res) => {
    // Create an instance of model SomeModel
    const { username, password, role, oneTimePassword, phone } = req.body;

    var userData = new User({
      _id: Helpers.uuidv4(),
      username: username,
      password: password,
      role: role === undefined ? ROLE.USER.name : role,
      email: username,
      phone: phone === undefined ? 0 : phone,
      oneTimePassword: oneTimePassword === undefined ? false : oneTimePassword,
      secret_2fa: encryptHelper.aes.encrypt(encryptHelper.totp.generateKey()),
    });

    // Save the new model instance, passing a callback
    userData.save(function (err, result) {
      if (err) res.json({ message: err.message });

      // saved!
      if (result) {
        res.json({
          _id: result._id,
          username: result.username,
          password: result.password,
          role: result.role,
          secret_2fa: result.secret_2fa,
        });
      }
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
            return res.status(401).send({
              code: 401,
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

          res.status(200).json({
            code: 200,
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
          return res.status(401).json({
            code: 401,
            ok: false,
            message: err.message,
          });
        }

        if (!user) {
          return res.status(200).json({
            code: 200,
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

          res.status(200).json({
            code: 200,
            ok: verified,
            message: "ok",
            rs: {
              access_token: jwtToken,
              verified_token: true,
            },
          });
        } else {
          res.status(200).json({
            code: 200,
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
          return res.status(401).json({
            code: 401,
            ok: false,
            message: err.message,
          });
        }

        if (!user) {
          return res.status(200).json({
            code: 200,
            ok: false,
            message: "User not found",
            rs: [],
          });
        }

        // generateToken from 2fa
        const secret = encryptHelper.aes.decrypt(user.secret_2fa);
        const token_2fa = encryptHelper.totp.generateToken(secret);

        const yourBand = `E-GO Stores ????`;
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

        res.status(200).json({
          code: 200,
          ok: true,
          message: "Code is sent to email: " + user.email,
        });
      });
  }),
  //#endregion
};
