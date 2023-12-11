import express from "express";
import Role from "../models/role.model.js";
import role from "#controllers/role.controller";
import base from "#controllers/_base.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerRole = express.Router();

//#region ROLES
// GET: /api/role/getbytype
routerRole.route("/getbytype/:typeId").get((req, res) => {
  role.GET_BY_TYPE(req, res);
});

// GET: api/role/getbyname
// routerRole.route("/getbyname/:name").get(role.GET_BY_NAME);
//#endregion

export default routerRole;
