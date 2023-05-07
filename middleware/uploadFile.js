import util from "util";
import {
  helpersExtension,
  stringExtension,
} from "../utils/helpersExtension.js";
import variables from "../shared/variables.js";
import multer from "multer";
import * as mime from "mime-types";
import path from "path";
import fs from "fs";
const __dirname = path.resolve();
const maxSize = 2 * 1024 * 1024; // 2Mb
const uploadFolder = path.join(__dirname, "/");

let multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadFolder, { recursive: true });
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    let filename =
      variables.DIR_UPLOADS +
      "/" +
      helpersExtension.generateKey(
        new Date().toISOString().replace(/[:-]/gi, "")
      );

    let ext = mime.extension(file.mimetype);

    cb(null, `${filename + "." + ext}`);
  },
});

const multerFileFilter = (req, file, cb) => {
  var filetypes = /jpeg|jpg|png|mp4/;
  var acceptUpload = true;

  if (!helpersExtension.acceptFileExtension(file, filetypes)) {
    acceptUpload = false;
    cb("File upload only supports the following filetypes - " + filetypes);
  }

  const fileSize = parseInt(req.headers["content-length"]);
  if (fileSize > maxSize) {
    acceptUpload = false;
    cb("File too large - max size is " + stringExtension.formatBytes(maxSize));
  }

  if (acceptUpload) return cb(null, true);
};

let uploadFile = multer({
  // dest: uploadFolder,
  storage: multerStorage,
  limits: { fileSize: maxSize },
  fileFilter: multerFileFilter,
}).single("avatar");

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;
