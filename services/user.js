import User from '../models/user.model.js';
import encryptHelper from '../utils/encrypt.helper.js';
import sessionHandler from '../middleware/sessionHandler.js';
import { datetime, object } from '../utils/crossCutting.js';
import stored from '../constant/storage.js';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS as statusCodes } from '../constant/httpStatus.js';

const expired = 60 * 60; // 1 hours

class UserService {
  /**
   * findByUser
   * @param {*} username need to use rsa encrypt this field
   * @returns
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
   * find user by token
   */
  static findByToken = (req) => {
    return new Promise((resolve) => {
      const token = sessionHandler.getCookie(req, stored.AUTH.ACCESS_TOKEN);
      if (token !== null && token !== undefined) {
        jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
          if (error) {
            return resolve(null);
          }

          const data = JSON.parse(decoded.data);

          //* get User by username from mongodb
          const username = encryptHelper.rsa.encrypt(data.username);
          UserService.findByUser(username).then((user) => {
            // remove secure data
            let newUser = object.omit(user, [
              'password',
              'oneTimePassword',
              'secret_2fa'
            ]);
            resolve(newUser);
          });
        });
      } else {
        resolve(null);
      }
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
      verified_token: verified_token || !userResponse.oneTimePassword
    };

    const expiresInRefeshToken =
      expiresInRefresshToken != null
        ? expiresInRefresshToken - datetime.toTimestamp(new Date())
        : parseInt(process.env.TOKEN_EXPIRESIN) * expired;

    const jwtToken = jwt.sign(
      { data: JSON.stringify(dataJwtToken) },
      process.env.JWT_TOKEN,
      {
        expiresIn: expiresInRefeshToken // 6 hour use for login
      }
    );

    // create refresh token
    const jwtRefreshToken = jwt.sign(
      { data: JSON.stringify(dataJwtToken) },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: expiresInRefeshToken // 6 hours
      }
    );

    return {
      token: jwtToken,
      refreshToken: jwtRefreshToken
    };
  };
}

export default UserService;
