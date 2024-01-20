import _globalVars from "../shared/variables.js";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";
import sessionHandler from "../middleware/sessionHandler.js";
import { crossCutting } from "./crossCutting.js";
import storaged from "../constant/storage.js";

export default {
  DEFAULT: (res, err, data, additionalData = {}) => {
    const code = statusCodes.OK;
    // error
    if (err) {
      return res.status(statusCodes.NO_CONTENT).send({
        code: statusCodes.NO_CONTENT,
        ok: false,
        message: err.message,
      });
    }

    const method = res.req.method;
    const dataIsNull = crossCutting.check.isNull(data);
    const dataLength = dataIsNull ? 0 : Array.isArray(data) ? data.length : 1;
    let messageOk = dataLength + " record(s) ";

    switch (method) {
      case "POST":
        messageOk += "inserted.";
        break;

      case "PUT":
        messageOk += "updated.";
        break;

      case "DELETE":
        messageOk += "deleted.";
        break;

      default:
        // is GET
        messageOk += "founded";
        break;
    }

    // not found
    if (dataIsNull) {
      return res.status(code).json({
        code: code,
        ok: true,
        message: "Not found!",
      });
    }

    const responseJson = {
      code: code,
      ok: true,
      message: messageOk,
      rs: data,
    };

    const mergedData = {
      ...responseJson,
      ...additionalData,
    };

    res.status(code).json(mergedData);
  },
  SECURE_COOKIE: (res, data) => {
    const code = statusCodes.OK;
    sessionHandler.setCookie(
      res,
      storaged.AUTH.ACCESS_TOKEN,
      data.access_token
    );
    sessionHandler.setCookie(
      res,
      storaged.AUTH.REFRESH_TOKEN,
      data.refresh_token
    );
    sessionHandler.setCookie(
      res,
      storaged.AUTH.VERIFIED_2FA,
      data.verified_token,
      "lax"
    );

    delete data.access_token;
    delete data.refresh_token;
    delete data.verified_token;

    res.status(code).json({
      code: code,
      ok: true,
      message: "Authentication success",
      rs: data,
    });
  },
  UPLOAD_FILE: (req, res, err) => {
    // error
    if (err) {
      return res.status(statusCodes.PRECONDITION_FAILED).send({
        code: err.code,
        ok: false,
        message: err,
      });
    }

    let code = statusCodes.OK;
    let data = req.file;
    if (req.files && req.files.length > 0) {
      data = req.files;
    }

    // not found
    if (data === null || data === undefined) {
      code = statusCodes.BAD_REQUEST;
      return res.status(code).send({
        code: code,
        ok: false,
        message: "Please upload a file.",
      });
    }

    // let protocol = res.req.protocol || "http";
    // let HOST = res.req.headers["host"];
    const method = res.req.method;
    const dataLength = data.length || 1;
    let messageOk = dataLength + " file(s) ";

    switch (method) {
      case "POST":
        messageOk += "uploaded successfully.";
        break;

      default:
        // is GET
        messageOk += "founded";
        break;
    }

    let dataFileNames = [];
    const { identifyfolder } = req.params;
    if (dataLength > 1) {
      data.forEach((item, index) => {
        dataFileNames.push(
          _globalVars.DIR_UPLOADS + "/" + identifyfolder + "/" + item.filename
        );
      });
    } else {
      dataFileNames.push(
        _globalVars.DIR_UPLOADS + "/" + identifyfolder + "/" + data.filename
      );
    }

    const responseJson = {
      code: code,
      ok: true,
      message: messageOk,
      rs: {
        filenames: dataFileNames,
      },
    };

    res.status(code).json(responseJson);
  },
};
