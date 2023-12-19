import express from "express";
import Industry from "../models/industries.model.js";
import IndustryController from "../controllers/industry.controller.js";
const routerIndustry = express.Router();

//#region INDUSTRIES
// GET: /api/industry/getall
routerIndustry.route("/getall").get((req, res) => {
  IndustryController.GET_BY_PAGING(req, res, Industry);
});
//#endregion

export default routerIndustry;
