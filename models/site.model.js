import mongoose from "mongoose";
// import RoutePathSchema from "./routepath.external.js";

//Define collection and schema for Business
var siteSchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String, //! DATATYPES
      lowercase: true,
      unique: true,
      trim: true,
      required: true,
    },
    locale: {
      type: Array, //! DATATYPES
      _id: String,
      code: { type: String },
      lang: { type: String },
      language_name: { type: String },
      date_format: { type: String },
      time_format: { type: String },
      is_default: { type: Boolean },
    },
    theme: {
      type: String, //! DATATYPES
      lowercase: true,
    },
    title: { type: Array }, //! DATATYPES
    is_active: {
      type: Boolean, //! DATATYPES
      default: true,
      default: "default"
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "sites",
  }
);

//#region queries
siteSchema.query.findByFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
};

// siteSchema.query.findByName = function (name) {
//   return this.findOne({
//     name: { $regex: new RegExp(name, "i") }, //make case-insensitive queries
//   }).lean();
// };

siteSchema.query.findById = function (id) {
  return this.where({ _id: id });
};
//#endregion

const Site = mongoose.model("sites", siteSchema);
export default Site;
