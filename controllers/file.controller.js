import asyncHandler from "express-async-handler";
import uploadFile from "#middleware/uploadFile";
import response from "../utils/response.helper.js";

export default {
  //uploadfile function to retrieve file info
  UPLOAD_FILE_SINGLE: asyncHandler(async (req, res) => {
    uploadFile.SINGLE(req, res, function (err) {
      response.UPLOAD_FILE(req, res, err);
    });
  }),
  // uploadFile multiple
  UPLOAD_FILES: asyncHandler(async (req, res) => {
    uploadFile.MULTIPLE(req, res, function (err) {
      response.UPLOAD_FILE(req, res, err);
    });
  }),
};
