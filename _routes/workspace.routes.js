import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerWorkspace = express.Router();

//#region WORKSPACES
// GET: api/workspace/getbypageno
// routerWorkspace
//   .route("/getbypageno/:pageno?&:pagesize?&:query?")
//   .get(verifyTokenJWT, (req, res) => {
//     base.GET_BY_PAGING(req, res, Workspace);
//   });

// GET: api/workspace/getbyuser
routerWorkspace
  .route("/getbyuser/:id")
  .get(verifyTokenJWT, WorkspaceController.GET_BY_USER);

// POST: api/workspace/insertnew
routerWorkspace
  .route("/insertnew")
  .post(verifyTokenJWT, WorkspaceController.INSERT_NEW);

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
