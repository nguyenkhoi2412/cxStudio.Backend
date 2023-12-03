import express from "express";
import { helpersExtension } from "./../utils/helpersExtension.js";
import encryptHelper from "./../utils/encrypt.helper.js";
import captcha from "./../utils/captcha.js";
import variables from "./../shared/variables.js";
import cache from "../utils/cache/cache.instance.js";
import response from "../utils/response.helper.js";

import fileRoutes from "./file.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import roleRouters from "./role.routes.js";
import siteRoutes from "./site.routes.js";
import typeRoutes from "./type.routes.js";
import supplierRoutes from "./supplier.routes.js";
import categoryRoutes from "./category.routes.js";
import articleRoutes from "./article.routes.js";

export default (app) => {
  //#region Request API callback generate
  // Human checkable test path, returns image for browser
  app.get("/api/captcha/test/:width?/:height?/:colortext?/", (req, res) => {
    const width = parseInt(req.params.width) || 150;
    const height = parseInt(req.params.height) || 50;
    const colortext = helpersExtension.isNotNull(req.params.colortext)
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
      password: helpersExtension.generatePassword(length),
      aes: {
        salt_key: encryptHelper.aes.generateKey(length_aes * 2),
      },
      rsa: encryptHelper.rsa.generateKey(length),
      otplib: encryptHelper.otplib.generateKey(),
    });
  });
  //#endregion

  // clear cache.flushAll()
  app.get("/api/cache/clearAll", (req, res) => {
    cache.clearAll();
    res.send(`Clear All Cached Datas`);
  });
  // put the HTML file containing your form in a directory named "public" (relative to where this script is located)
  app.use("/" + variables.DIR_UPLOADS, express.static(variables.DIR_UPLOADS)); // public access folder upload
  app.use("/undefined", (req, res) => {});
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/file", fileRoutes);
  app.use("/api/role", roleRouters);

  app.use("/api/site", siteRoutes);
  app.use("/api/type", typeRoutes);
  app.use("/api/supplier", supplierRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/article", articleRoutes);
};
