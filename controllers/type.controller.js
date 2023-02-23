import asyncHandler from "express-async-handler";
import Type from "../models/type.model.js";
import response from "../utils/response.helper.js";

export default {
  //getbysite function to retrieve site info
  GET_BY_SITE: asyncHandler(async (req, res) => {
    const { site_ref } = req.params;

    Type.findOne()
      .findBySite(site_ref)
      .exec((err, rs) => {
        response.DEFAULT(res, err, rs);
      });
  }),
};
