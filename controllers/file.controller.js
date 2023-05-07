import asyncHandler from "express-async-handler";
import uploadFile from "../middleware/uploadFile.js";
import response from "../utils/response.helper.js";

export default {
  //uploadfile function to retrieve file info
  UPLOAD_FILE_SINGLE: asyncHandler(async (req, res) => {
    uploadFile.SINGLE(req, res, function (err) {
      response.UPLOAD_FILE(res, err, req.file);
    });
  }),
  UPLOAD_FILES: asyncHandler(async (req, res) => {
    uploadFile.MULTIPLES(req, res, function (err) {
      response.UPLOAD_FILE(res, err, req.file);
    });
  }),
};
