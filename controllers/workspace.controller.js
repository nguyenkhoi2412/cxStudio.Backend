import asyncHandler from "express-async-handler";
import BaseController from "./_base.controller.js";
import Workspace from "../models/workspace.model.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import response from "../utils/response.helper.js";
import WorkspaceService from "../services/workspace.js";
import { ROLE } from "../constant/role.js";

class WorkspaceController extends BaseController {
  //getbyuser function to retrieve site info
  static GET_BY_USER = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await WorkspaceService.getByUser(id)
      .then((rs) => {
        response.DEFAULT(res, null, rs);
      })
      .catch((err) => {
        response.DEFAULT(res, err, null);
      });
  });

  //insertnew function
  static INSERT_NEW = asyncHandler(async (req, res) => {
    var modelBody = req.body;
    await WorkspaceService.insert(modelBody)
      .then((savedWP) => {
        response.DEFAULT(res, null, savedWP);
      })
      .catch((err) => {
        response.DEFAULT(res, err, null);
      });
  });
}

export default WorkspaceController;
