import express from "express";
import Category from "#models/category.model";
import base from "#controllers/_base.controller";
import cate from "#controllers/category.controller";
import verifyTokenJWT from "#middleware/authJwt";
const routerCategory = express.Router();

//#region CATEGORIES

// GET: api/category/getbypageno
routerCategory
  .route("/getbypageno/:pageno&:pagesize&:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_PAGING(req, res, Category);
  });

// GET: api/category/getbytype
routerCategory.route("/getbytype/:id").get(verifyTokenJWT, (req, res) => {
  cate.GET_BY_TYPE(req, res, Category);
});

// // GET: api/category/filter
// routerCategory.route("/filter/:query").get(verifyTokenJWT, (req, res) => {
//   base.GET_BY_FILTER(req, res, Category);
// });

// GET: api/category/getbyid
routerCategory.route("/getbyid/:id").get(verifyTokenJWT, (req, res) => {
  base.GET_BY_FILTER(req, res, Category);
});

// POST: api/category/insertnew
routerCategory.route("/insertnew").post(verifyTokenJWT, (req, res) => {
  base.INSERT(req, res, Category);
});

// PUT: api/category/update
routerCategory.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, Category);
});

// DELETE: api/category/delete
routerCategory.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
  cate.DELETE(req, res, Category);
});
//#endregion

export default routerCategory;
