import express from "express";
import auth from "../controllers/auth.controller.js";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerAuth = express.Router();

//#region USERS
// GET: api/auth/findByUser
routerAuth.route("/findbyuser/").get(auth.FIND_BY_USER);

// GET: api/auth/refreshtoken
routerAuth.route("/refreshtoken/").get(auth.REFRESH_TOKEN);

// POST: api/auth/validate
routerAuth.route("/validate/:username&:password").get(auth.VALIDATE_USER);

// POST: api/auth/register
routerAuth.route("/register/").post(auth.REGISTER_USER);

// POST: api/auth/changepassword
routerAuth.route("/changepassword/").put(verifyTokenJWT, auth.CHANGE_PASSWORD);

// POST: api/auth/recoverypassword
routerAuth.route("/recoverypassword/:username").get(auth.RECOVERY_PASSWORD);

// GET: api/auth/secure_2fa/gettoken
routerAuth
  .route("/secure_2fa/gettoken/:id")
  .get(verifyTokenJWT, auth.SECURE_2FA_GENERATE_TOKEN);

// POST: api/auth/secure_2fa/code
routerAuth
  .route("/secure_2fa/validate")
  .post(verifyTokenJWT, auth.VALIDATE_SECURE_2FA);
//#endregion

export default routerAuth;
