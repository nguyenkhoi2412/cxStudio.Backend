import express from "express";
import Survey from "../models/survey.model.js";
import base from "../controllers/base.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerSurvey = express.Router();

//#region SURVEYS
// GET: api/survey/getbyfilter
routerSurvey
  .route("/getbyfilter/:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_FILTER(req, res, Survey);
  });


// GET: api/survey/getbypageno
routerSurvey
  .route("/getbypageno/:pageno&:pagesize&:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_PAGING(req, res, Survey);
  });

// POST: api/survey/insertnew
routerSurvey.route("/insertnew").post(verifyTokenJWT, (req, res) => {
  base.INSERT(req, res, Survey);
});

// PUT: api/survey/update
routerSurvey.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, Survey);
});

// DELETE: api/survey/delete
routerSurvey.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
  base.DELETE(req, res, Survey);
});
//#endregion

export default routerSurvey;
