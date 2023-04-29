import express from "express";
import Question from "../models/question.model.js";
import base from "../controllers/base.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerQuestion = express.Router();

//#region QUESTIONS
// GET: api/question/getbyfilter
routerQuestion
  .route("/getbyfilter/:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_FILTER(req, res, Question);
  });

// GET: api/question/getbypageno
routerQuestion
  .route("/getbypageno/:pageno&:pagesize&:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_PAGING(req, res, Question);
  });

// POST: api/question/insertnew
routerQuestion.route("/insertnew").post(verifyTokenJWT, (req, res) => {
  base.INSERT(req, res, Question);
});

// PUT: api/question/update
routerQuestion.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, Question);
});

// DELETE: api/question/delete
routerQuestion.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
  base.DELETE(req, res, Question);
});
//#endregion

export default routerQuestion;
