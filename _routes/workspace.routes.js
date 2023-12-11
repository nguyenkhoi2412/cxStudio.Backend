import express from "express";
import controller from "#controllers/workspace.controller";
import Workspace from "#models/workspace.model";
import base from "#controllers/_base.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerWorkspace = express.Router();

//#region WORKSPACES
// GET: api/workspace/getbypageno
routerWorkspace
  .route("/getbypageno/:pageno?&:pagesize?&:query?")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_PAGING(req, res, Workspace);
  });

// GET: api/workspace/getbysite
routerWorkspace
  .route("/getbysite/:id")
  .get(controller.GET_BY_SITE);

// // POST: api/workspace/insertnew
// routerWorkspace.route("/insertnew").post(verifyTokenJWT, (req, res) => {
//   base.INSERT(req, res, Workspace);
// });

// // PUT: api/workspace/update
// routerWorkspace.route("/update").put(verifyTokenJWT, (req, res) => {
//   base.UPDATE(req, res, Workspace);
// });

// // DELETE: api/workspace/delete
// routerWorkspace.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
//   base.DELETE(req, res, Workspace);
// });
//#endregion

export default routerWorkspace;
