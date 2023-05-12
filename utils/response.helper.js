import variables from "../shared/variables.js";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";

export default {
  DEFAULT: (res, err, data, additionalData = {}) => {
    const code = statusCodes.OK;

    // error
    if (err) {
      return res.status(code).json({
        code: code,
        ok: false,
        message: err.message,
      });
    }

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

    // not found
    if (!data) {
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
  UPLOAD_FILE: (req, res, err) => {
    let code = statusCodes.OK;
    let data = req.file;
    if (req.files && req.files.length > 0) {
      data = req.files;
    }
    const { identifyfolder } = req.params;

    // error
    if (err) {
      return res.status(code).json({
        code: code,
        ok: false,
        message: err,
      });
    }

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

    // not found
    if (!data) {
      code = statusCodes.BAD_REQUEST;
      return res.status(code).json({
        code: code,
        ok: false,
        message: "Please upload a file.",
      });
    }

    let dataFileNames = [];
    if (dataLength > 1) {
      data.forEach((item, index) => {
        dataFileNames.push(
          variables.DIR_UPLOADS + "/" + identifyfolder + "/" + item.filename
        );
      });
    } else {
      dataFileNames.push(
        variables.DIR_UPLOADS + "/" + identifyfolder + "/" + data.filename
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
