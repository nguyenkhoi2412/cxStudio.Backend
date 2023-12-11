import express from "express";
import Article from "../models/article.model.js";
import articleController from "#controllers/article.controller";
import base from "#controllers/_base.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerArticle = express.Router();

//#region ARTICLES
// GET: api/article/getbypageno
routerArticle
  .route("/getbypageno/:pageno&:pagesize&:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_PAGING(req, res, Article);
  });

// GET: api/article/getbycategory
routerArticle.route("/getbycategory/:id").get(verifyTokenJWT, (req, res) => {
  articleController.GET_BY_CATEGORY(req, res, Article);
});

// GET: api/article/getbysupplier
routerArticle.route("/getbysupplier/:id").get(verifyTokenJWT, (req, res) => {
  articleController.GET_BY_SUPPLIER(req, res, Article);
});

// GET: api/article/getbyid
routerArticle.route("/getbyid/:id").get(verifyTokenJWT, (req, res) => {
  base.GET_BY_FILTER(req, res, Article);
});

// POST: api/article/insertnew
routerArticle.route("/insertnew").post(verifyTokenJWT, (req, res) => {
  base.INSERT(req, res, Article);
});

// PUT: api/article/update
routerArticle.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, Article);
});

// DELETE: api/article/delete
routerArticle.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
  base.DELETE(req, res, Article);
});
//#endregion

export default routerArticle;
