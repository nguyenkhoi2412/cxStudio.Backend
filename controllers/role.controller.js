import asyncHandler from "express-async-handler";
import { ROLE } from "../shared/enums.js";
import Role from "../models/role.model.js";
import response from "../utils/response.helper.js";

export default {
  //getbyname function to retrieve role info
  GET_BY_NAME: asyncHandler(async (req, res) => {
    const { name } = req.params;

    Role.findOne()
      .findByName(name)
      .exec((err, role) => {
        response.DEFAULT(res, err, role);
      });
  }),
};
