import express from "express";
import user from "../controllers/user.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerUser = express.Router();

//#region USERS
// GET: api/users
routerUser.route("/").get(verifyTokenJWT, user.GET_USERS);

// GET: api/users/id
routerUser.route("/:id").get(user.GET_USER_BY_ID);
//#endregion

export default routerUser;
