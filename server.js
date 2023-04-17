import https from "https";
import http from "http";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import csrf from "csurf";
import dbService from "./config/dbService.js";
import corsOptions from "./config/corsOptions.js";
import _apiRouters from "./routes/_api.routes.js";
import { stringExtension } from "./utils/helpersExtension.js";

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

//connect database
dbService.connect((err) => {
  if (err) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5009;
  //Express js listen method to run project on https://e-gostore.vn:5009
  // app.listen(PORT, function () {
  //   console.log(`App is running mode on port ${PORT}`);
  // });
  // https.createServer(options, app).listen(PORT, function () {
  //   console.log(`App is running mode on port ${PORT}`);
  // });
  http.createServer(app).listen(PORT, function () {
    console.log(`App is running mode on port ${PORT}`);
  });

  app.get("/", (req, res, next) => {
    res.send("Server started\n");
  });
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

// handle request url
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({
      code: 405,
      ok: false,
      message: `Method ${req.method} not allowed.`,
    });
  }

  // remove xss from url
  // req.getUrl = function () {
  //   return stringExtension.stripedHtml(
  //     req.protocol + "://" + req.get("host") + req.originalUrl
  //   );
  // };

  return next();
});

//Request API for clients callback
_apiRouters(app);
