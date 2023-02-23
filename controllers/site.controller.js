import asyncHandler from "express-async-handler";
import Site from "../models/site.model.js";
import response from "../utils/response.helper.js";

export default {
  //getbyname function to retrieve site info
  GET_BY_NAME: asyncHandler(async (req, res) => {
    const { name } = req.params;

    Site.findOne()
      .findByName(name)
      .exec((err, site) => {
        response.DEFAULT(res, err, site);
      });
  }),
};
