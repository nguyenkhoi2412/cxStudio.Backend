import mongoose from "mongoose";
import { crossCutting } from "../utils/crossCutting.js";

//Define collection and schema for Business
var roleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: crossCutting.uuidv4() },
    name: {
      type: Object,
      required: true,
      trim: true,
    },
    lowercase: {
      type: String,
      lowercase: true,
      required: true,
    },
    desc: {
      type: String,
    },
    power: {
      type: Array,
    },
    type: {
      type: Number,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "roles",
  }
);

//#region queries
roleSchema.query.byFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
};

roleSchema.query.byType = function (typeId) {
  return this.where({ type: typeId }).lean();
};

roleSchema.query.byName = function (name) {
  return this.findOne({
    name: { $regex: new RegExp(name, "i") }, //make case-insensitive queries
  }).lean();
};
//#endregion

const Role = mongoose.model("roles", roleSchema);
export default Role;
