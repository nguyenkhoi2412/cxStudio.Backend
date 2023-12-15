import asyncHandler from "express-async-handler";
import Workspace from "../models/workspace.model.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import response from "../utils/response.helper.js";
import WorkspaceService from "../services/workspace.js";
import { ROLE } from "../constant/role.js";

export default {
  //getbysite function to retrieve site info
  GET_BY_SITE: asyncHandler(async (req, res) => {
    const { site_id } = req.params;

    Workspace.findOne()
      .bySite(site_id)
      .then((err, rs) => {
        response.DEFAULT(res, err, rs);
      });
  }),

  //insertnew function
  INSERT_NEW: asyncHandler(async (req, res) => {
    var modelBody = req.body;
    const savedWP = await WorkspaceService.insert(modelBody);
    response.DEFAULT(res, null, savedWP);
  }),
};
