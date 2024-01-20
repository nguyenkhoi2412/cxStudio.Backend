import _globalVars from "../shared/variables.js";
import { crossCutting } from "../utils/crossCutting.js";
import encryptHelper from "../utils/encrypt.helper.js";

export default {
  // sentCookie creates a cookie which expires after one day
  setCookie: (res, name, value, sameSite = "strict") => {
    // Our token expires after one day: 24 * 60 * 60 * 1000
    var date = new Date();
    date.setTime(
      date.getTime() +
        (process.env.TOKEN_EXPIRESIN || _globalVars.TOKEN_EXPIRESIN) *
          60 *
          60 *
          1000
    ); // 6 hours

    value = encryptHelper.base64.encrypt(value + "");

    res.clearCookie(name);
    res.cookie(name, value, {
      expires: date,
      // maxAge: date,
      // You can't access these tokens in the client's javascript
      httpOnly: true,
      sameSite: sameSite, // strict/lax/none
      // Forces to use https in production
      secure: process.env.NODE_ENV === "production",
      signed: true,
    });
  },
  // returns an object with the cookies' name as keys
  getCookie: (req, name = "") => {
    // We extract the raw cookies from the request headers
    // const rawCookies = req.headers.cookie.split("; ");
    // // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

    // const parsedCookies = {};
    // rawCookies.forEach((rawCookie) => {
    //   const parsedCookie = rawCookie.split("=");
    //   // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
    //   parsedCookies[parsedCookie[0]] = parsedCookie[1];
    // });

    if (crossCutting.check.isNotNull(name)) {
      return encryptHelper.base64.decrypt(req.signedCookies[name]);
    }

    // We extract the raw cookies from the request headers
    const rawCookies = req.signedCookies;
    const parsedCookies = {};
    console.log;
    Object.keys(rawCookies).filter((key) => {
      parsedCookies[key] = encryptHelper.base64.decrypt(rawCookies[key]);
    });

    return parsedCookies;
  },
  clearCookies: (req, res) => {
    // We extract the raw cookies from the request headers
    const rawCookies = req.headers.cookie?.split("; ");
    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
    };

    rawCookies?.forEach((rawCookie) => {
      const parsedCookie = rawCookie.split("=");
      res.clearCookie(parsedCookie[0], options);
    });
  },
};
