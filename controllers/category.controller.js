// import asyncHandler from "express-async-handler";
// import Category from "../models/category.model.js";
// import response from "../utils/response.helper.js";

// export default {
//   //getbytype function to retrieve category info
//   GET_BY_TYPE: asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     Category.findOne()
//       .findByType(id)
//       .exec((err, rs) => {
//         response.DEFAULT(res, err, rs);
//       });
//   }),
//   DELETE: asyncHandler(async (req, res, DataModel) => {
//     // check ids
//     const ids = req.params.ids.split(",");

//     // check condition delete data when have children empty
//     await DataModel.find({
//       parent: {
//         $in: ids, // [10, 88, 2, 5, 8]
//       },
//     }).exec((errData, rsData) => {
//       //! cant delete
//       if (rsData.length) {
//         res.status(200).json({
//           code: 200,
//           ok: false,
//           message: "You cannot delete while there are still constraints.",
//           rs: [],
//         });
//       }
//       //TODO: can delete data
//       else {
//         // delete one
//         if (ids.length === 1) {
//           //delete one
//           DataModel.findOneAndDelete({ _id: ids[0] }).exec((err, rs) => {
//             response.DEFAULT(res, err, rs);
//           });
//         }
//         // delete many
//         else {
//           var filter = {
//             _id: {
//               $in: ids, // [10, 88, 2, 5, 8]
//             },
//           };

//           DataModel.find(filter).exec((errData, rsData) => {
//             //delete
//             DataModel.deleteMany(filter).exec((err, rsDelete) => {
//               response.DEFAULT(res, err, rsData);
//             });
//           });
//         }
//       }
//     });
//   }),
// };
