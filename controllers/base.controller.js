import asyncHandler from "express-async-handler";
import response from "../utils/response.helper.js";
import encrypt from "../utils/encrypt.helper.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import cache from "../utils/cache/cache.instance.js";

export default {
  GET_BY_PAGING: asyncHandler(async (req, res, DataModel) => {
    const { pageno, pagesize } = req.params;
    const { sortCriteria, filterCriteria } = encrypt.aes.decrypt(
      req.params.query
    );

    const skip = !helpersExtension.isNotNull(pageno) ? 1 : parseInt(pageno) - 1; // pageno
    const limit = !helpersExtension.isNotNull(pagesize)
      ? 1000
      : parseInt(pagesize); // pagesize
    const sortInfos = helpersExtension.isNotNull(sortCriteria)
      ? sortCriteria
      : { created_at: -1 }; //default with sort created_at asc: 1/desc: -1

    const filterInfos = helpersExtension.isNotNull(filterCriteria)
      ? filterCriteria
      : {};

    // get data with pageno
    await DataModel.countDocuments(filterInfos, (err, count) => {
      DataModel.find()
        .findByFilter(filterInfos)
        .sort(sortInfos)
        .skip(limit * skip)
        .limit(limit)
        .exec((err, rs) => response.DEFAULT(res, err, rs, { total: count }));
    });
  }),

  GET_BY_FILTER: asyncHandler(async (req, res, DataModel) => {
    // findById
    const id = req.params.id;
    if (helpersExtension.isNotNull(id)) {
      const modelData = await cache.get(id);

      // check data from cache
      if (cache.has(id)) {
        return response.DEFAULT(res, null, modelData);
      }

      // get data from db
      await DataModel.findById(id).exec((err, rs) => {
        cache.set(id, rs);
        return response.DEFAULT(res, err, rs);
      });
    } else {
      // filter with query
      const query = encrypt.aes.decrypt(req.params.query);
      await DataModel.find()
        .findByFilter(query)
        .exec((err, rs) => response.DEFAULT(res, err, rs));
    }
  }),

  //insertnew function to insert new data
  INSERT: asyncHandler(async (req, res, DataModel) => {
    var model = new DataModel(req.body);
    // await dbService.db.connection.collection("categories").insertOne(model, (err, rs) => {
    //   response.DEFAULT(res, err, rs.ops[0]);
    // });
    model._id = helpersExtension.uuidv4();

    // Save the new model instance, passing a callback
    await model.save((err, rs) => {
      if (!err && rs) {
        DataModel.find()
          .findByFilter({ _id: model._id })
          .exec((error, rsData) => {
            response.DEFAULT(res, err, rsData);
          });
      } else {
        response.DEFAULT(res, err, rs);
      }
    });
  }),

  //update function
  UPDATE: asyncHandler(async (req, res, DataModel) => {
    var model = req.body;
    model.updated_at = new Date();

    var filter = { _id: model._id };
    var updateValues = { $set: model };
    // Save update
    await DataModel.findOneAndUpdate(filter, updateValues, {
      upsert: true,
      new: true,
      returnNewDocument: true,
    }).exec((err, rs) => {
      if (!err && rs) {
        DataModel.find()
          .findByFilter(filter)
          .exec((error, rsData) => {
            //! Special case for DataModel is User
            rsData.map((item) => {
              // remove secure data
              delete item.password;
              delete item.secret_2fa;

              return item;
            });

            response.DEFAULT(res, err, rsData);
          });
      } else {
        response.DEFAULT(res, err, rs);
      }
    });
  }),

  UPDATE_MANY: asyncHandler(async (req, res, DataModel) => {
    // var model = req.body;
    // model.updated_at = new Date();
    // var filter = { _id: model._id };
    // var updateValues = { $set: model };
    // // Save update
    // await DataModel.findOneAndUpdate(filter, updateValues, {
    //   upsert: true,
    //   new: true,
    //   returnNewDocument: true,
    // }).exec((err, rs) => {
    //   if (!err && rs) {
    //     DataModel.find()
    //       .findByFilter(filter)
    //       .exec((error, rsData) => {
    //         response.DEFAULT(res, err, rsData);
    //       });
    //   } else {
    //     response.DEFAULT(res, err, rs);
    //   }
    // });
  }),

  //delete
  DELETE: asyncHandler(async (req, res, DataModel) => {
    // check ids
    const ids = req.params.ids.split(",");

    // delete one
    if (ids.length === 1) {
      //delete one
      await DataModel.findOneAndDelete({ _id: ids[0] }).exec((err, rs) => {
        response.DEFAULT(res, err, rs);
      });
    }
    // delete many
    else {
      var filter = {
        _id: {
          $in: ids, // [10, 88, 2, 5, 8]
        },
      };

      await DataModel.find(filter).exec((errData, rsData) => {
        //delete
        DataModel.deleteMany(filter).exec((err, rsDelete) => {
          response.DEFAULT(res, err, rsData);
        });
      });
    }
  }),
};
