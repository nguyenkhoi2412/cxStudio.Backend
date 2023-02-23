import express from "express";
import UserAnswer from "../models/user_answer.model.js";
import base from "../controllers/base.controller.js";
import user_answer from "../controllers/user_answer.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerUserAnswer = express.Router();

//#region USER_ANSWERS
// GET: api/user/answer/getbyfilter
routerUserAnswer
  .route("/getbyfilter/:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_FILTER(req, res, UserAnswer);
  });

  // GET: api/user/answer/getbyid/:id
routerUserAnswer
.route("/getbyid/:id")
.get(verifyTokenJWT, (req, res) => {
  base.GET_BY_FILTER(req, res, UserAnswer);
});

// // GET: api/question/getbypageno
// routerUserAnswer
//   .route("/getbypageno/:pageno&:pagesize&:query")
//   .get(verifyTokenJWT, (req, res) => {
//     base.GET_BY_PAGING(req, res, UserAnswer);
//   });

// POST: api/user/answer/validate
routerUserAnswer.route("/validate").post(user_answer.VALIDATE_USER);

// PUT: api/user/answer/update
routerUserAnswer.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, UserAnswer);
});

// // DELETE: api/question/delete
// routerUserAnswer.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
//   base.DELETE(req, res, UserAnswer);
// });
// //#endregion

export default routerUserAnswer;
