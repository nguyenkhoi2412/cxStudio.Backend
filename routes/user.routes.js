import express from "express";
import user from "../controllers/user.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerUser = express.Router();

//#region USERS
// GET: api/user/findByUser
routerUser.route("/findbyuser/").get(user.FIND_BY_USER);

// GET: api/user/refreshtoken
routerUser.route("/refreshtoken/").get(user.REFRESH_TOKEN);

// POST: api/user/validate
routerUser.route("/validate/").post(user.VALIDATE_USER);

// POST: api/user/register
routerUser.route("/register/").post(user.REGISTER_USER);

// GET: api/user/secure_2fa/gettoken
routerUser
  .route("/secure_2fa/gettoken/:id")
  .get(verifyTokenJWT, user.SECURE_2FA_GENERATE_TOKEN);

// POST: api/user/secure_2fa/code
routerUser.route("/secure_2fa/validate").post(verifyTokenJWT, user.VALIDATE_SECURE_2FA);
//#endregion

export default routerUser;
