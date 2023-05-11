import { ROLE } from "../constant/enumRoles.js";
import { ACCOUNT_STATUS } from "../constant/enumAccountStatus.js";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";
import jwt from "jsonwebtoken";
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyTokenJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // || req.headers["x-access-token"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== null) {
    jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
      if (error) {
        return catchError(error, res);
      }

      const data = JSON.parse(decoded.data);
      //! check Method Not Allowed
      const rolename = data.role;

      const notAllowed =
        ROLE[rolename.toUpperCase()].power.indexOf(req.method) === -1;

      if (notAllowed) {
        return res
          .status(statusCodes.METHOD_NOT_ALLOWED) //* 405 Method Not Allowed
          .json({
            code: statusCodes.METHOD_NOT_ALLOWED,
            ok: false,
            message: "Method Not Allowed!",
          });
      }

      //! check user status?
      if (data.status !== ACCOUNT_STATUS.ACTIVE.name) {
        console.log(ACCOUNT_STATUS[data.status].description);
        return res
          .status(statusCodes.LOCKED) //* 423 Locked
          .json({
            code: statusCodes.LOCKED,
            ok: false,
            message: ACCOUNT_STATUS[data.status].description,
          });
      }

      //* get url request from client
      const originalUrl = req.originalUrl;
      //* condition allow for url contain secure_2fa
      if (!data.verified_token && originalUrl.indexOf("secure_2fa") === -1) {
        return res
          .status(statusCodes.UNAUTHORIZED) // 401 Unauthorized
          .json({
            code: statusCodes.UNAUTHORIZED,
            ok: false,
            message: "Unauthorized!",
          });
      }

      req.data = data;
      next();
    });
  } else {
    return res.status(403).send({ message: "No token provided!" });
  }
};

export default verifyTokenJWT;
