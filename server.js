import https from "https";
import http from "http";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
// import csrf from "csurf";
import dbService from "./config/dbService.js";
import cache from "./config/cacheService.js";
import SocketService from "./services/socket.js";
import corsOptions from "./config/corsOptions.js";
import _apiRouters from "./_routes/_api.routes.js";

//dotenv config, read data in .env
dotenv.config();

const app = express();
//#region security
app.use(helmet());

//create https
const options = {
  key: fs.readFileSync("./cert/key.pem", "utf-8"),
  cert: fs.readFileSync("./cert/cert.pem", "utf-8"),
};
//#endregion
cache.connect();

//#region CONNECT DATABASE
dbService.connect((err) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5009;
  //Express js listen method to run project on https://localhost:5009
  // app.listen(PORT, function () {
  //   console.log(`App is running mode on port ${PORT}`);
  // });
  // https.createServer(options, app).listen(PORT, function () {
  //   console.log(`App is running mode on port ${PORT}`);
  // });
  const server = http.createServer(app).listen(PORT, function () {
    console.log(`Server is successfully running...`);
    console.log(`App is listening on port ${PORT}`);
  });

  //#region CONNECTION SOCKET
  SocketService.connect(server);
  //#endregion

  app.get("/", (req, res, next) => {
    res.send("Server started\n");
  });
});
//#endregion

//#region Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
//#endregion

// handle request url
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

  if (!allowedMethods.includes(req.method)) {
    //* 405 Method Not Allowed
    res.status(405).send({
      code: 405,
      ok: false,
      message: `Method ${req.method} not allowed.`,
    });
  }

  // // handle cache-control
  // // here you can define period in second, this one is (60 * 5) => 5 minutes
  // // you only want to cache for GET requests
  // if (req.method == "GET") {
  //   res.set(`Cache-control`, `public, max-age=${process.env.CACHE_DURATION}`);
  // } else {
  //   // for the other requests set strict no caching parameters
  //   res.set("Cache-control", `no-store`);
  // }

  if (req.url.match(/^\/(css|js|img|font)\/.+/)) {
    res.set(`Cache-control`, "public, max-age=3600"); // 1 hours
  }

  // remove xss from url
  // req.getUrl = function () {
  //   return stringExtension.stripedHtml(
  //     req.protocol + "://" + req.get("host") + req.originalUrl
  //   );
  // };

  return next();
});

// // Logging the rejected field from multer error
// app.use((error, req, res, next) => {
//   console.log('This is the rejected field ->', error.field);
// });

//Request API for clients callback
_apiRouters(app);
