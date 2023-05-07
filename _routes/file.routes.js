import express from "express";
import file from "../controllers/file.controller.js";
const routerFile = express.Router();

//#region ARTICLES
// POST: api/file/upload
routerFile.route("/upload").post((req, res) => {
  file.UPLOAD_FILE_SINGLE(req, res);
});
//#endregion

export default routerFile;
