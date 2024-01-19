import { ROLE } from "../constant/role.js";
import stored from "../constant/storageHandler.js";
import { ACCOUNT_STATUS } from "../constant/enumAccountStatus.js";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(statusCodes.UNAUTHORIZED) // 401 Unauthorized
      .send({
        code: statusCodes.UNAUTHORIZED,
        ok: false,
        message: "Unauthorized! Access Token was expired!",
      });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyTokenJWT = (req, res, next) => {
  // const authHeader = req.headers["authorization"]; // || req.headers["x-access-token"];
  const token = req.cookies && req.cookies[stored.AUTH.ACCESS_TOKEN];

  if (token !== null && token !== undefined) {
    jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
      if (error) {
        return catchError(error, res);
      }

      const data = JSON.parse(decoded.data);

      //* get User by username from mongodb
      User.findOne()
        .byUsername(data.username)
        .then((user) => {
          //! User not found
          if (!user) {
            return res.status(statusCodes.OK).json({
              code: statusCodes.OK,
              ok: false,
              message: "Not found!",
              rs: [],
            });
          }

          //! check user status?
          if (user.status !== ACCOUNT_STATUS.ACTIVE.TEXT) {
            return res
              .status(statusCodes.LOCKED) //* 423 Locked
              .send({
                code: statusCodes.LOCKED,
                ok: false,
                message: ACCOUNT_STATUS[user.status].DESC,
              });
          }

          //! check Method Not Allowed
          const rolename = user.role;
          const notAllowed =
            ROLE[rolename.toUpperCase()].power.indexOf(req.method) === -1;

          if (notAllowed) {
            return res
              .status(statusCodes.METHOD_NOT_ALLOWED) //* 405 Method Not Allowed
              .send({
                code: statusCodes.METHOD_NOT_ALLOWED,
                ok: false,
                message: "Method Not Allowed!",
              });
          }

          //* get url request from client
          const originalUrl = req.originalUrl;
          //! condition allow for url contain secure_2fa
          //! important use data.verified_token for check here
          if (
            !data.verified_token &&
            originalUrl.indexOf("secure_2fa") === -1
          ) {
            return res
              .status(statusCodes.UNAUTHORIZED) // 401 Unauthorized
              .send({
                code: statusCodes.UNAUTHORIZED,
                ok: false,
                message: "Unauthorized!",
              });
          }

          req.data = user;
          next();
        })
        .catch((err) => {
          return res.status(statusCodes.UNAUTHORIZED).send({
            code: statusCodes.UNAUTHORIZED,
            ok: false,
            message: "Unauthorized!",
          });
        });
    });
  } else {
    return res.status(statusCodes.UNAUTHORIZED).send({
      code: statusCodes.UNAUTHORIZED,
      ok: false,
      message: "No token provided!",
    });
  }
};

export default verifyTokenJWT;
