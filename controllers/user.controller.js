import asyncHandler from "express-async-handler";
import { ROLE } from "../shared/enums.js";
import User from "../models/user.model.js";
import { Helpers } from "../utils/helpers.js";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import jwt from "jsonwebtoken";

export default {
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
            rs: [],
          });
        }

        // // send code token by email when user have secure 2fa
        // if (user.oneTimePassword) {
        //   // generate token secure 2fa
        //   const token_2fa = encryptHelper.totp.generateToken(
        //     encryptHelper.aes.decrypt(user.secret_2fa)
        //   );

        //   transportHelper.mail.smtp({
        //     to: user.email,
        //     subject: "Token to signin",
        //     text: token_2fa,
        //     html: "Please enter your token: " + token_2fa,
        //   });
        // }

        // create token header
        const jwtToken = jwt.sign({ data: user }, process.env.JWT_TOKEN, {
          expiresIn: parseInt(process.env.TOKEN_EXPIRESIN), // 4 hours
        });

        // create refresh token
        const jwtRefreshToken = jwt.sign(
          { data: user },
          process.env.JWT_REFRESH_TOKEN,
          {
            expiresIn: parseInt(process.env.TOKEN_EXPIRESIN) * 6, // 24 hours
          }
        );

        let userResponse = { ...user.toJSON() };

        // remove secure data
        delete userResponse.password;
        delete userResponse.secret_2fa;

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
  //#region secure
  //validate token from 2FA
  VALIDATE_SECURE_2FA: asyncHandler(async (req, res) => {
    var username = encryptHelper.rsa.decrypt(req.body.username);
    var token = req.body.token;

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

        // validate token from 2fa
        const verified = encryptHelper.totp.verified(
          encryptHelper.aes.decrypt(user.secret_2fa),
          token
        );

        if (verified) {
          res.status(200).json({
            code: 200,
            ok: verified,
            message: "ok",
            rs: {
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

  //generate token 2fa
  SECURE_2FA_GENERATE_TOKEN: asyncHandler(async (req, res) => {
    var username = encryptHelper.rsa.decrypt(req.params.username);

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

        // generateToken from 2fa
        const secret = encryptHelper.aes.decrypt(user.secret_2fa);
        // var url = speakeasy.otpauthURL({ secret: secret.base32, label: 'egostores', algorithm: 'sha512' });
        // console.log(url);
        const token_2fa = encryptHelper.totp.generateToken(secret);

        transportHelper.mail.smtp({
          to: user.email,
          subject: "Token to signin",
          text: token_2fa,
          html: "Please enter your token: " + token_2fa,
        });

        res.status(200).json({
          code: 200,
          ok: true,
          message: "Code is sent to email: " + user.email,
        });
      });
  }),
  //refreshtoken function to retrieve new token
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

          const user = decoded.data;
          const jwtToken = jwt.sign({ data: user }, process.env.JWT_TOKEN, {
            expiresIn: 3600,
          });

          res.status(200).json({
            code: 200,
            ok: true,
            message: "ok",
            rs: {
              currentUser: {
                ...user,
                password: "",
              },
              access_token: jwtToken,
              refresh_token: refreshToken,
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
};
