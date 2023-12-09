import express from "express";
import Role from "#models/role.model";
import role from "#controllers/role.controller";
import base from "#controllers/_base.controller";
import verifyTokenJWT from "#middleware/authJwt";
const routerRole = express.Router();

//#region ROLES
// GET: /api/role/getall
routerRole
  .route("/getall/:query")
  .get((req, res) => {
    base.GET_BY_FILTER(req, res, Role);
  });

// GET: api/role/getbyname
routerRole.route("/getbyname/:name").get(role.GET_BY_NAME);
//#endregion

export default routerRole;
