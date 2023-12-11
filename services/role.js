import asyncHandler from "express-async-handler";
import { ROLE } from "../constant/enumRoles.js";
import Role from "#models/role.model";
import { helpersExtension } from "../utils/helpersExtension.js";
import { TEMPLATES } from "../shared/templates.js";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import response from "../utils/response.helper.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";
import cache from "../utils/cache/index.js";

class RoleService {
  /*
   * findByType
   */
  static findByType = (req, res, typeId) => {
    return new Promise(async (resolve) => {
      const { originalUrl } = req;
      // check data from cache
      if (await cache.has(originalUrl)) {
        resolve(await cache.get(originalUrl));
      }

      Role.find()
        .byType(typeId)
        .then((rs) => {
          cache.set(originalUrl, rs);
          resolve(rs);
        })
        .catch((err) => response.DEFAULT(res, err, null));
    });
  };
}

export default RoleService;
