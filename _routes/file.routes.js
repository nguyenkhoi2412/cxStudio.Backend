import express from "express";
import file from "#controllers/file.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerFile = express.Router();

//#region ARTICLES
// POST: api/file/upload/
routerFile
  .route("/upload/:type?/:identifyfolder?/")
  .post(verifyTokenJWT, (req, res) => {
    const { type } = req.params;

    switch (type) {
      case "multiple":
        file.UPLOAD_FILES(req, res);
        break;

      default:
        file.UPLOAD_FILE_SINGLE(req, res);
        break;
    }
  });
//#endregion

export default routerFile;
