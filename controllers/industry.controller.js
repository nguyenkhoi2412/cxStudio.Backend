import asyncHandler from "express-async-handler";
import BaseController from "./_base.controller.js";
import Industry from "../models/industries.model.js";
import IndustryService from "../services/industry.js";
import response from "../utils/response.helper.js";

class IndustryController extends BaseController {
  static GET_ALL = asyncHandler(async (req, res) => {
    req.params.pageno = 1;
    req.params.pagesize = 100;

    await this.GET_BY_PAGING(req, res, Industry).then((rs) => {
      response.DEFAULT(res, null, rs);
    });
  });
}

export default IndustryController;
