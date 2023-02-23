import express from "express";
import controller from "../controllers/type.controller.js";
import Type from "../models/type.model.js";
import base from "../controllers/base.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerType = express.Router();

//#region TYPES
// GET: api/type/getbypageno
routerType
  .route("/getbypageno/:pageno?&:pagesize?&:query?")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_PAGING(req, res, Type);
  });

// GET: api/type/getbysite
routerType
  .route("/getbysite/:site_ref")
  .get(controller.GET_BY_SITE);

// POST: api/type/insertnew
routerType.route("/insertnew").post(verifyTokenJWT, (req, res) => {
  base.INSERT(req, res, Type);
});

// PUT: api/type/update
routerType.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, Type);
});

// DELETE: api/type/delete
routerType.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
  base.DELETE(req, res, Type);
});
//#endregion

export default routerType;
