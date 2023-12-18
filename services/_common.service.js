import encrypt from "../utils/encrypt.helper.js";
import { crossCutting } from "../utils/crossCutting.js";
import cache from "../utils/cache/index.js";

class CommonService {
  /**
   * If you use findById, params is { id: xxx },
   * and if you use find, params is { query: encrypt{filter}}
   * @param params
   * @param ModelSchema
   **/
  static getByFilter = async (params, ModelSchema) => {
    return new Promise(async (resolve, reject) => {
      // findById
      const { id } = params;

      if (crossCutting.isNotNull(id)) {
        // check data from cache
        if (await cache.has(id)) {
          resolve(await cache.get(id));
        }

        // get data from db
        await ModelSchema.findById(id)
          .lean()
          .then((rs) => {
            cache.set(id, rs); //* SAVE CACHE
            resolve(rs);
          });
      } else {
        // filter with query
        const query = encrypt.aes.decrypt(req.params?.query);
        await ModelSchema.find(query)
          .lean()
          .then((rs) => {
            cache.set(id, rs); //* SAVE CACHE
            resolve(rs);
          });
      }
    });
  };
}

export default CommonService;
