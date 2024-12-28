import express from 'express';
import passport from 'passport';
import auth from '../controllers/auth.controller.js';
import verifyTokenJWT from '../middleware/authJwt.js';
import response from '../utils/response.helper.js';
import sessionHandler from '../middleware/sessionHandler.js';
const routerAuth = express.Router();

//#region AUTHENTICATION
// GET: api/auth/signout
routerAuth.route('/signout').get(auth.SIGN_OUT);

// GET: api/auth/refreshtoken
routerAuth.route('/refreshtoken').get(auth.REFRESH_TOKEN);

// POST: api/auth/validate
routerAuth.route('/validate/:username&:password').get(auth.VALIDATE_USER);

// POST: api/auth/register
routerAuth.route('/register').post(auth.REGISTER_USER);

// POST: api/auth/changepassword
routerAuth.route('/changepassword').put(verifyTokenJWT, auth.CHANGE_PASSWORD);

// POST: api/auth/recoverypassword
routerAuth.route('/recoverypassword/:username').get(auth.RECOVERY_PASSWORD);

// GET: api/auth/secure_2fa/gettoken
routerAuth
  .route('/secure_2fa/gettoken/:id')
  .get(verifyTokenJWT, auth.SECURE_2FA_GENERATE_TOKEN);

// POST: api/auth/secure_2fa/code
routerAuth
  .route('/secure_2fa/validate')
  .post(verifyTokenJWT, auth.VALIDATE_SECURE_2FA);

// GET: api/auth/secure
routerAuth.route('/secure').get((req, res) => {
  response.DEFAULT(res, null, sessionHandler.getCookie(req));
});
//#endregion

//#endregion AUTHENTICATION SOCIAL MEDIA
routerAuth
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET: api/auth/google/callback
routerAuth
  .route('/google/callback')
  .get(
    passport.authenticate('google', { failureRedirect: '/' }),
    auth.GOOGLE.GET_PROFILE_INFO
  );

// routerAuth.route('/facebook').get(passport.authenticate('facebook'));

// // GET: api/auth/facebook/callback
// routerAuth
//   .route('/facebook/callback')
//   .get(
//     passport.authenticate('facebook', { failureRedirect: '/' }),
//     auth.GOOGLE.GET_PROFILE_INFO
//   );
//#endregion

export default routerAuth;
