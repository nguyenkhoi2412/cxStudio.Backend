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
const maxSize = 1 * 1024 * 1024; // 1Mb

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    var { identifyfolder } = req.params;
    var uploadFolder =
      path.join(__dirname, "/" + variables.DIR_UPLOADS + "/") + identifyfolder;
    var stat = null;
    try {
      stat = fs.statSync(uploadFolder);
    } catch (err) {
      fs.mkdirSync(uploadFolder);
    }
    if (stat && !stat.isDirectory()) {
      throw new Error(
        'Directory cannot be created because an inode of a different type exists at "' +
          dest +
          '"'
      );
    }

    cb(null, uploadFolder);

    // fs.mkdirSync(uploadFolder, { recursive: true });
    // cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    let filename = helpersExtension.generateKey(
      new Date().toISOString().replace(/[:-]/gi, "")
    );

    let ext = mime.extension(file.mimetype);

    cb(null, `${filename + "." + ext}`);
  },
});

const multerFileFilter = (req, file, cb) => {
  var filetypes = /jpeg|jpg|png/;
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

// upload single file
const uploadFileSingle = multer({
  storage: multerStorage,
  limits: { fileSize: maxSize },
  fileFilter: multerFileFilter,
}).single("single");
const uploadFileSingleMiddleware = util.promisify(uploadFileSingle);

// upload file multiple max files 6
const uploadFileMultiple = multer({
  storage: multerStorage,
  limits: { fileSize: maxSize },
  fileFilter: multerFileFilter,
}).array("multiple", 6);
const uploadFileMultiplesMiddleware = util.promisify(uploadFileMultiple);

export default {
  SINGLE: uploadFileSingleMiddleware,
  MULTIPLE: uploadFileMultiplesMiddleware,
};
