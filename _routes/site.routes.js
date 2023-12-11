import express from "express";
import Site from "../models/site.model.js";
import site from "#controllers/site.controller";
import base from "#controllers/_base.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerSite = express.Router();

//#region SITES
// GET: api/site/getbypageno
routerSite
  .route("/getbypageno/:pageno?&:pagesize?&:query?")
  .get((req, res) => {
    base.GET_BY_PAGING(verifyTokenJWT, req, res, Site);
  });

// GET: api/site/getbyname
// routerSite.route("/getbyname/:name").get(site.GET_BY_NAME);

// GET: api/site/getbyid
routerSite.route("/getbyid/:id").get((req, res) => {
  base.GET_BY_FILTER(req, res, Site);
});

// // POST: api/site/insertnew
// routerSite.route("/insertnew").post(verifyTokenJWT, (req, res) => {
//   base.INSERT(req, res, Site);
// });

// // PUT: api/site/update
// routerSite.route("/update").put(verifyTokenJWT, (req, res) => {
//   base.UPDATE(req, res, Site);
// });
//#endregion

export default routerSite;
