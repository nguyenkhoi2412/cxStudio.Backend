import encrypt from '../utils/encrypt.helper.js';
import { crossCutting } from '../utils/crossCutting.js';
import cache from '../utils/cache/index.js';

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

      if (crossCutting.check.isNotNull(id)) {
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

  /**
   * Get data by paging
   **/
  static getByPaging = async (params, ModelSchema) => {
    return new Promise(async (resolve, reject) => {
      const { pageno, pagesize, query } = params;
      const { sortCriteria, filterCriteria } = crossCutting.check.isNotNull(
        query,
      )
        ? encrypt.aes.decrypt(query)
        : {
            sortCriteria: null,
            filterCriteria: null,
          };

      const skip = !crossCutting.check.isNotNull(pageno)
        ? 0
        : parseInt(pageno) - 1; // pageno
      const limit = !crossCutting.check.isNotNull(pagesize)
        ? 1000
        : parseInt(pagesize); // pagesize

      const sortInfos = crossCutting.check.isNotNull(sortCriteria)
        ? sortCriteria
        : { created_at: -1 }; //default with sort created_at asc: 1/desc: -1

      const filterInfos = crossCutting.check.isNotNull(filterCriteria)
        ? filterCriteria
        : {};

      // get data with pageno
      // await ModelSchema.countDocuments({}).then((count) => {
      //   console.log("count", count);
      //   // ModelSchema.find(filterInfos)
      //   //   // .sort(sortInfos)
      //   //   // .skip(limit * skip)
      //   //   // .limit(limit)
      //   //   .then((rs) => {
      //   //     console.log("rs", rs);
      //   //     response.DEFAULT(res, null, rs, { total: count });
      //   //   });
      //   resolve(count);
      // });
      await ModelSchema.countDocuments(filterInfos).then((count) => {
        ModelSchema.find(filterInfos)
          .sort(sortInfos)
          .limit(limit)
          .skip(limit * skip)
          .then((rs) => {
            resolve({
              data: [...rs],
              total: count,
            });
          });
      });
    });
  };
}

export default CommonService;
