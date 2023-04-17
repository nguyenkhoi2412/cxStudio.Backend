import mongoose from "mongoose";
import { helpersExtension } from "../utils/helpersExtension.js";

//Define collection and schema for Business
var typeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    site_ref: { type: String, ref: "sites" },
    name: { type: Object, trim: true },
    icon_name: { type: String },
    path_name: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "types",
  }
);

//#region queries
typeSchema.query.findByFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
  // .populate("site_ref", "name locale");
};

typeSchema.query.findBySite = function (site_ref) {
  return this.find({
    site_ref: site_ref,
  })
    .select({ name: 1, icon_name: 1, path_name: 1 })
    .lean()
    .populate("site_ref", "name locale");
};
//#endregion

const Type = mongoose.model("types", typeSchema);
export default Type;
