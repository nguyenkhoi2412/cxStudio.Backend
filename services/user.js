import User from "../models/user.model.js";
import encryptHelper from "../utils/encrypt.helper.js";
import { datetime } from "../utils/crossCutting.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";

const expired = 60 * 60; // 1 hours

class UserService {
  /*
   * findByUser
   */
  static findByUser = (username) => {
    return new Promise((resolve) => {
      var usernameDescrypt = encryptHelper.rsa.decrypt(username);

      User.findOne()
        .byUsername(usernameDescrypt)
        .then((user) => {
          resolve(user);
        });
    });
  };

  /*
   * jwtSignTokenForUser
   */
  static jwtSignTokenForUser = (
    userResponse,
    verified_token = null,
    expiresInRefresshToken = null
  ) => {
    const dataJwtToken = {
      username: userResponse.username,
      role: userResponse.role,
      status: userResponse.status,
      verified_token: verified_token || !userResponse.oneTimePassword,
    };

    const expiresInRefeshToken =
      expiresInRefresshToken != null
        ? expiresInRefresshToken - datetime.toTimestamp(new Date())
        : parseInt(process.env.TOKEN_EXPIRESIN) * expired;

    const jwtToken = jwt.sign(
      { data: JSON.stringify(dataJwtToken) },
      process.env.JWT_TOKEN,
      {
        expiresIn: expiresInRefeshToken, // 6 hour use for login
      }
    );

    // create refresh token
    const jwtRefreshToken = jwt.sign(
      { data: JSON.stringify(dataJwtToken) },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: expiresInRefeshToken, // 6 hours
      }
    );

    return {
      token: jwtToken,
      refreshToken: jwtRefreshToken,
    };
  };
}

export default UserService;
