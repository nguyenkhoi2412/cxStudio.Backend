import asyncHandler from "express-async-handler";
import { ROLE } from "#constant/enumRoles";
import Workspace from "#models/workspace.model";
import { helpersExtension } from "#utils/helpersExtension";
import { TEMPLATES } from "#shared/templates";
import encryptHelper from "#utils/encrypt.helper";
import transportHelper from "#utils/transport.helper";
import response from "#utils/response.helper";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "#constant/httpStatus";

class WorkspaceService {
  /*
   * findBySite
   */
  static findBySite = (req, res, siteId) => {
    return new Promise((resolve) => {
      Workspace.findOne()
        .findBySite(siteId)
        .exec((err, wp) => {
          if (err) {
            response.DEFAULT(res, err, {});
          }

          resolve(wp);
        });
    });
  };
}

export default WorkspaceService;
