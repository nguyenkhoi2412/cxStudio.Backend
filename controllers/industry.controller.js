import asyncHandler from "express-async-handler";
import BaseController from "./_base.controller.js";
import Industry from "../models/industries.model.js";
import IndustryService from "../services/industry.js";
import response from "../utils/response.helper.js";

class IndustryController extends BaseController {}

export default IndustryController;
