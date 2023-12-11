import asyncHandler from "express-async-handler";
import { ROLE } from "../constant/enumRoles.js";
import Role from "../models/role.model.js";
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
  static findByType = (typeId) => {
    return new Promise(async (resolve) => {
      const cacheKey = "findByType" + typeId;
      // check data from cache
      if (await cache.has(cacheKey)) {
        resolve(await cache.get(cacheKey));
      }

      Role.find()
        .byType(typeId)
        .then((rs) => {
          cache.set(cacheKey, rs);
          resolve(rs);
        });
    });
  };
}

export default RoleService;
