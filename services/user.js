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

const expired = 60 * 60; // 1 hours

class UserService {
  /*
   * findByUser
   */
  static findByUser = (req, res, username) => {
    return new Promise((resolve) => {
      var usernameDescrypt = encryptHelper.rsa.decrypt(username);

      User.findOne()
        .findByUsername(usernameDescrypt)
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
              message: "Not found!",
              rs: [],
            });
          }

          resolve(user);
        });
    });
  };

  /*
   * verifyPassword
   */
  static verifyPassword = (req, res, username, password) => {
    return new Promise((resolve) => {
      this.findByUser(req, res, username).then((user) => {
        // check verify password
        if (!user.verifyPassword(password)) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "Authentication failed. Incorrect username/password",
            rs: {},
          });
        }

        resolve(user);
      });
    });
  };

  /*
   * jwtSignTokenForUser
   */
  static jwtSignTokenForUser = (userResponse) => {
    const dataJwtToken = {
      username: userResponse.username,
      role: userResponse.role,
      status: userResponse.status,
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

    return {
      token: jwtToken,
      refreshToken: jwtRefreshToken,
    };
  };
}

export default UserService;
