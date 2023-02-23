import asyncHandler from "express-async-handler";
import Article from "../models/article.model.js";
import response from "../utils/response.helper.js";

export default {
  //getbycategory function to retrieve articles info
  GET_BY_CATEGORY: asyncHandler(async (req, res) => {
    const { id } = req.params;

    Article.findOne()
      .findByCategory(id)
      .exec((err, rs) => {
        response.DEFAULT(res, err, rs);
      });
  }),

  //getbysupplier function to retrieve articles info
  GET_BY_SUPPLIER: asyncHandler(async (req, res) => {
    const { id } = req.params;

    Article.findOne()
      .findBySupplier(id)
      .exec((err, rs) => {
        response.DEFAULT(res, err, rs);
      });
  }),
};
