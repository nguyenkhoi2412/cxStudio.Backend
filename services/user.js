import User from "../models/user.model.js";
import encryptHelper from "../utils/encrypt.helper.js";
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
  static jwtSignTokenForUser = (userResponse, verified_token = null) => {
    const dataJwtToken = {
      username: userResponse.username,
      role: userResponse.role,
      status: userResponse.status,
      verified_token: verified_token || !userResponse.oneTimePassword,
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
