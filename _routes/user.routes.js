import express from "express";
import User from "../models/user.model.js";
import base from "#controllers/_base.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerUser = express.Router();

//#region USER/ACCOUNTS
// PUT: api/user/update
routerUser.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, User);
});

// DELETE: api/user/delete
routerUser.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
  base.DELETE(req, res, User);
});
//#endregion

export default routerUser;
