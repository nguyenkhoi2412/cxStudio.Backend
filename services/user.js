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

class UserService {
  /*
   * findByUser
   * {
   *    username
   * }
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
              message: "User not found",
              rs: [],
            });
          }

          resolve(user);
        });
    });
  };

  /*
   * verifyPassword
   * {
   *    username,
   *    password
   * }
   */
  static verifyPassword = (req, res, username, password) => {
    return new Promise((resolve) => {
      this.findByUser(req, res, username).then((user) => {
        // check verify password
        if (!user.verifyPassword(password)) {
          return res.status(statusCodes.OK).json({
            code: statusCodes.OK,
            ok: false,
            message: "Authentication failed. Incorrect password",
            rs: {},
          });
        }

        resolve(user);
      });
    });
  };
}

export default UserService;
