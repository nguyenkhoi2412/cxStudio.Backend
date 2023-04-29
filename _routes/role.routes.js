import express from "express";
import Role from "../models/role.model.js";
import role from "../controllers/role.controller.js";
import base from "../controllers/base.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
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
