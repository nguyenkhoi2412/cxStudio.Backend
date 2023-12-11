import asyncHandler from "express-async-handler";
import Role from "#models/role.model";
import RoleService from "../services/role.js";
import response from "../utils/response.helper.js";

export default {
  GET_BY_TYPE: asyncHandler(async (req, res) => {
    const { typeId } = req.params;
    await RoleService.findByType(req, res, typeId).then((rs) => {
      response.DEFAULT(res, null, rs);
    });
  }),

  // //getbyname function to retrieve role info
  // GET_BY_NAME: asyncHandler(async (req, res) => {
  //   const { name } = req.params;

  //   Role.findOne()
  //     .byName(name)
  //     .then((role) => {
  //       response.DEFAULT(res, null, role);
  //     });
  // }),
};
