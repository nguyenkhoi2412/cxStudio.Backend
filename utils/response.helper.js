import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";

export default {
  DEFAULT: (res, err, data, additionalData = {}) => {
    const code = statusCodes.OK;
    const method = res.req.method;
    const dataLength =
      data === null || data === undefined || data.length === undefined
        ? 1
        : data.length;
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

    // error
    if (err) {
      return res.status(code).json({
        code: code,
        ok: false,
        message: err.message,
      });
    }

    // not found
    if (!data) {
      return res.status(code).json({
        code: code,
        ok: true,
        message: "Data not found",
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
  UPLOAD_FILE: (res, err, data) => {
    let code = statusCodes.OK;
    // let protocol = res.req.protocol || "http";
    // let HOST = res.req.headers["host"];
    const method = res.req.method;
    const dataLength =
      data === null || data === undefined || data.length === undefined
        ? 1
        : data.length;
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

    // error
    if (err) {
      code = statusCodes.UNAUTHORIZED;
      switch (err.code) {
        default:
          return res.status(code).json({
            code: code,
            ok: false,
            message: err,
          });
      }
    }

    // not found
    if (!data) {
      code = statusCodes.BAD_REQUEST;
      return res.status(code).json({
        code: code,
        ok: false,
        message: "Please upload a file.",
      });
    }

    const responseJson = {
      code: code,
      ok: true,
      message: messageOk,
      rs: {
        filename: data.filename,
      },
    };

    res.status(code).json(responseJson);
  },
};
