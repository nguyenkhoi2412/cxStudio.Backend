import asyncHandler from "express-async-handler";
import response from "../utils/response.helper.js";
import encrypt from "../utils/encrypt.helper.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import cache from "../utils/cache/index.js";
import CommonService from "../services/_common.service.js";

class BaseController {
  // static GET_BY_PAGING = asyncHandler(async (req, res, ModelSchema) => {
  //   const { pageno, pagesize } = req.params;
  //   const { sortCriteria, filterCriteria } = encrypt.aes.decrypt(
  //     req.params.query
  //   );

  //   const skip = !helpersExtension.isNotNull(pageno) ? 1 : parseInt(pageno) - 1; // pageno
  //   const limit = !helpersExtension.isNotNull(pagesize)
  //     ? 1000
  //     : parseInt(pagesize); // pagesize
  //   const sortInfos = helpersExtension.isNotNull(sortCriteria)
  //     ? sortCriteria
  //     : { created_at: -1 }; //default with sort created_at asc: 1/desc: -1

  //   const filterInfos = helpersExtension.isNotNull(filterCriteria)
  //     ? filterCriteria
  //     : {};

  //   // get data with pageno
  //   await ModelSchema.countDocuments(filterInfos, (err, count) => {
  //     ModelSchema.find()
  //       .byFilter(filterInfos)
  //       .sort(sortInfos)
  //       .skip(limit * skip)
  //       .limit(limit)
  //       .exec((err, rs) => response.DEFAULT(res, err, rs, { total: count }));
  //   });
  // });

  static GET_BY_ID = asyncHandler(async (req, res, ModelSchema) => {
    CommonService.getByFilter(req.params, ModelSchema)
      .then((rs) => {
        return response.DEFAULT(res, null, rs);
      })
      .catch((err) => {
        return response.DEFAULT(res, err, null);
      });
  });

  static GET_BY_FILTER = asyncHandler(async (req, res, ModelSchema) => {
    CommonService.getByFilter(req.params, ModelSchema)
      .then((rs) => {
        return response.DEFAULT(res, null, rs);
      })
      .catch((err) => {
        return response.DEFAULT(res, err, null);
      });
  });

  // //insertnew function to insert new data
  // static INSERT = asyncHandler(async (req, res, ModelSchema) => {
  //   var model = new ModelSchema(req.body);
  //   // await dbService.db.connection.collection("categories").insertOne(model, (err, rs) => {
  //   //   response.DEFAULT(res, err, rs.ops[0]);
  //   // });
  //   model._id = helpersExtension.uuidv4();

  //   // Save the new model instance, passing a callback
  //   await model.save((err, rs) => {
  //     if (!err && rs) {
  //       ModelSchema.find()
  //         .byFilter({ _id: model._id })
  //         .then((rsData) => {
  //           response.DEFAULT(res, null, rsData);
  //         });
  //     } else {
  //       response.DEFAULT(res, err, rs);
  //     }
  //   });
  // });

  // //update function
  // static UPDATE = asyncHandler(async (req, res, ModelSchema) => {
  //   var model = req.body;
  //   model.updated_at = new Date();

  //   var filter = { _id: model._id };
  //   var updateValues = { $set: model };
  //   // Save update
  //   await ModelSchema.findOneAndUpdate(filter, updateValues, {
  //     upsert: true,
  //     new: true,
  //     returnNewDocument: true,
  //   }).exec((err, rs) => {
  //     if (!err && rs) {
  //       ModelSchema.find()
  //         .byFilter(filter)
  //         .exec((error, rsData) => {
  //           //! Special case for ModelSchema is User
  //           rsData.map((item) => {
  //             // remove secure data
  //             delete item.password;
  //             delete item.secret_2fa;

  //             return item;
  //           });

  //           response.DEFAULT(res, err, rsData);
  //         });
  //     } else {
  //       response.DEFAULT(res, err, rs);
  //     }
  //   });
  // });

  // static UPDATE_MANY = asyncHandler(async (req, res, ModelSchema) => {
  //   // var model = req.body;
  //   // model.updated_at = new Date();
  //   // var filter = { _id: model._id };
  //   // var updateValues = { $set: model };
  //   // // Save update
  //   // await ModelSchema.findOneAndUpdate(filter, updateValues, {
  //   //   upsert: true,
  //   //   new: true,
  //   //   returnNewDocument: true,
  //   // }).exec((err, rs) => {
  //   //   if (!err && rs) {
  //   //     ModelSchema.find()
  //   //       .byFilter(filter)
  //   //       .exec((error, rsData) => {
  //   //         response.DEFAULT(res, err, rsData);
  //   //       });
  //   //   } else {
  //   //     response.DEFAULT(res, err, rs);
  //   //   }
  //   // });
  // });

  // //delete
  // static DELETE = asyncHandler(async (req, res, ModelSchema) => {
  //   // check ids
  //   const ids = req.params.ids.split(",");

  //   // delete one
  //   if (ids.length === 1) {
  //     //delete one
  //     await ModelSchema.findOneAndDelete({ _id: ids[0] }).exec((err, rs) => {
  //       response.DEFAULT(res, err, rs);
  //     });
  //   }
  //   // delete many
  //   else {
  //     var filter = {
  //       _id: {
  //         $in: ids, // [10, 88, 2, 5, 8]
  //       },
  //     };

  //     await ModelSchema.find(filter).exec((errData, rsData) => {
  //       //delete
  //       ModelSchema.deleteMany(filter).exec((err, rsDelete) => {
  //         response.DEFAULT(res, err, rsData);
  //       });
  //     });
  //   }
  // });
}

export default BaseController;
