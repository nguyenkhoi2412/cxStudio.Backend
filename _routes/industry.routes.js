import express from "express";
import industry from "../controllers/industry.controller.js";
const routerIndustry = express.Router();

//#region INDUSTRIES
// GET: /api/industry/getall
routerIndustry.route("/getall").get((req, res) => {
  industry.GET_BY_TYPE(req, res);
});
//#endregion

export default routerIndustry;
