import express from "express";
import { crossCutting } from "../utils/crossCutting.js";
import encryptHelper from "../utils/encrypt.helper.js";
import sessionHandler from "../middleware/sessionHandler.js";
import captcha from "../utils/captcha.js";
import variables from "../shared/variables.js";
import cache from "../utils/cache/cache.instance.js";
import response from "../utils/response.helper.js";

import fileRoutes from "#routes/file.routes";
import authRoutes from "#routes/auth.routes";
import userRoutes from "#routes/user.routes";
import roleRouters from "#routes/role.routes";
import industryRouters from "#routes/industry.routes";
import siteRoutes from "#routes/site.routes";
import workspaceRoutes from "#routes/workspace.routes";

export default (app) => {
  //#region Request API callback generate
  // Human checkable test path, returns image for browser
  app.get("/api/captcha/test/:width?/:height?/:colortext?/", (req, res) => {
    const width = parseInt(req.params.width) || 150;
    const height = parseInt(req.params.height) || 50;
    const colortext = crossCutting.check.isNotNull(req.params.colortext)
      ? req.params.colortext
      : "#000";

    const { image } = captcha(width, height, colortext);
    res.send(`<img class="generated-captcha" src="${image}">`);
  });

  // Captcha generation, returns PNG data URL and validation text
  app.get("/api/captcha/:width?/:height?/:colortext?/", (req, res) => {
    const width = parseInt(req.params.width) || 150;
    const height = parseInt(req.params.height) || 50;
    const { image, text } = captcha(width, height);
    res.send({ image, text });
  });

  // Generate SecretKey
  app.get("/api/generate/secretkey/:length?/", (req, res) => {
    var length = parseInt(req.params.length) || 1024;
    var length_aes = length / 16;
    res.send({
      password: crossCutting.generate.password(length),
      aes: {
        salt_key: encryptHelper.aes.generateKey(length_aes * 2),
      },
      rsa: encryptHelper.rsa.generateKey(length),
      otplib: encryptHelper.otplib.generateKey(),
    });
  });
  //#endregion

  //#region storage
  // clear cache.flushAll()
  app.get("/api/cache/clearall", (req, res) => {
    cache.clearCache();
    res.send(`Clear All Cached Datas`);
  });

  // read cookie
  app.get("/api/cookie/get", (req, res) => {
    response.DEFAULT(res, null, req.cookies);
  });

  // clear all cookie
  app.get("/api/cookie/clearlall", (req, res) => {
    sessionHandler.clearCookies(req, res);
    res.send(`Clear All Cookies Datas`);
  });
  //#endregion

  // put the HTML file containing your form in a directory named "public" (relative to where this script is located)
  app.use("/" + variables.DIR_UPLOADS, express.static(variables.DIR_UPLOADS)); // public access folder upload
  app.use("/undefined", (req, res) => {});
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/file", fileRoutes);
  app.use("/api/role", roleRouters);
  app.use("/api/industry", industryRouters);
  app.use("/api/site", siteRoutes);
  app.use("/api/workspace", workspaceRoutes);
};
