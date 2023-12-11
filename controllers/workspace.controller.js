import asyncHandler from "express-async-handler";
import Workspace from "#models/workspace.model";
import response from "../utils/response.helper.js";

export default {
  //getbysite function to retrieve site info
  GET_BY_SITE: asyncHandler(async (req, res) => {
    const { site_id } = req.params;

    Workspace.findOne()
      .findBySite(site_id)
      .exec((err, rs) => {
        response.DEFAULT(res, err, rs);
      });
  }),
};
