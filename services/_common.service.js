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

        await ModelSchema.aggregate([
          {
            $match: {
              _id: id
            }
          }
        ]).then((rs) => {
          const resData = crossCutting.check.isNotNull(rs) ? rs[0] : null;
          cache.set(id, resData); //* SAVE CACHE

          resolve({
            data: resData,
            totalCount: crossCutting.check.isNull(resData) ? 0 : 1
          });
        });
      } else {
        // filter with query
        // const query = encrypt.aes.decrypt(req.params?.query);
        // await ModelSchema.find(query)
        //   .lean()
        //   .then((rs) => {
        //     cache.set(id, rs); //* SAVE CACHE
        //     resolve(rs);
        //   });
      }
    });
  };

  /**
   * Get data by paging
   **/
  static getByPaging = async (params, ModelSchema) => {
    return new Promise(async (resolve, reject) => {
      const { pageno, pagesize } = params;

      let query = null;
      if (params.hasOwnProperty('query')) query = params.query;

      const { sortCriteria, filterCriteria } = crossCutting.check.isNotNull(
        query
      )
        ? encrypt.aes.decrypt(query)
        : {
            sortCriteria: null,
            filterCriteria: null
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

      // await Post.aggregate([
      //   {
      //     $lookup: {
      //       from: 'comments',
      //       localField: '_id',
      //       foreignField: 'post_ref',
      //       as: 'comments'
      //     }
      //   },
      //   {
      //     $match: {
      //       'post.en': { $regex: `${`xin tôi lời khuyên`}`, $options: 'i' }
      //     }
      //   },
      //   // Skip the specified number of documents based on the offset
      //   { $skip: skip * limit || 0 },
      //   { $limit: Number(limit) }
      // ]).then((rs) => {
      //   console.log('rsrsrsrs', rs);
      // });

      // get data with pageno
      await ModelSchema.countDocuments(filterInfos).then((count) => {
        ModelSchema.find()
          .byFilter(filterInfos)
          .sort(sortInfos)
          .limit(limit)
          .skip(limit * skip)
          .then((rs) => {
            resolve({
              data: [...rs],
              countData: count
            });
          });
      });
    });
  };
}

export default CommonService;
