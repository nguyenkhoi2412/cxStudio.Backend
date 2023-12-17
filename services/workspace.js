import { ROLE } from "../constant/role.js";
import Workspace from "../models/workspace.model.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import cache from "../utils/cache/index.js";
import CommonService from "./_common.service.js";

class WorkspaceService extends CommonService {
  /**
   * getByUser
   * @param id
   **/
  static getByUser = async (id) => {
    return new Promise(async (resolve, reject) => {
      if (await cache.has(id)) {
        resolve(await cache.get(id));
      }

      const data = await Workspace.find({
        is_active: true,
        team_members: {
          $elemMatch: { user: id },
        },
      })
        .lean()
        .populate({
          path: "team_members.user",
          select: "_id email detailInfos",
        });

      await cache.set(id, data);
      resolve(data);
    });
  };

  /**
   * Insert new workspace
   * @param params
   **/
  static insert = async (params) => {
    return new Promise(async (resolve, reject) => {
      const ModelSchema = new Workspace({
        ...params,
        _id: helpersExtension.uuidv4(),
        team_members: [
          {
            user: params.currentuser_id,
            role: ROLE.OWNER.name,
          },
        ],
      });

      // delete cache
      await cache.del(params.currentuser_id);
      const savedWorkspace = await ModelSchema.save();

      // get data after save
      const workspaceData = await Workspace.findById(savedWorkspace._id)
        .lean()
        .populate({
          path: "team_members.user",
          select: "_id email detailInfos",
        });

      resolve(workspaceData);
    });
  };
}

export default WorkspaceService;
