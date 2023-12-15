import asyncHandler from "express-async-handler";
import { ROLE } from "../constant/role.js";
import Workspace from "../models/workspace.model.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import { TEMPLATES } from "../shared/templates.js";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import response from "../utils/response.helper.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";

class WorkspaceService {
  /*
   * getBySite
   */
  static getBySite = async (siteId) => {
    const data = await Workspace.find().bySite(siteId);
    return data;
  };

  /*
   * Insert new workspace
   */
  static insert = async (params) => {
    const ModelSchema = new Workspace({
      ...params,
      _id: helpersExtension.uuidv4(),
      team_members: [params.currentuser_id],
      owner: params.currentuser_id,
    });

    const savedWorkspace = await ModelSchema.save();

    // get data after save
    const workspaceData = await Workspace.findById(savedWorkspace._id)
      .lean()
      .populate({ path: "team_members", select: "_id email detailInfos" })
      .populate({ path: "owner", select: "_id email detailInfos" });

    return workspaceData;
  };
}

export default WorkspaceService;
