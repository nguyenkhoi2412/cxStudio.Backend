export default {
  // sentCookie creates a cookie which expires after one day
  setCookie: (res, name, value) => {
    // Our token expires after one day: 24 * 60 * 60
    const oneDayToSeconds = process.env.TOKEN_EXPIRESIN * 60 * 60;
    res.clearCookie(name);
    res.cookie(name, value, {
      maxAge: oneDayToSeconds,
      // You can't access these tokens in the client's javascript
      httpOnly: true,
      sameSite: "strict", // lax/none
      // Forces to use https in production
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
  },
  // returns an object with the cookies' name as keys
  getCookie: (req) => {
    // We extract the raw cookies from the request headers
    const rawCookies = req.headers.cookie.split("; ");
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

    const parsedCookies = {};
    rawCookies.forEach((rawCookie) => {
      const parsedCookie = rawCookie.split("=");
      // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
      parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
  },
};
