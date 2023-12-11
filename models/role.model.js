import mongoose from "mongoose";
import { helpersExtension } from "#utils/helpersExtension";

//Define collection and schema for Business
var roleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: helpersExtension.uuidv4() },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lowercase: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    power: {
      type: Array,
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

roleSchema.query.byName = function (name) {
  return this.findOne({
    name: { $regex: new RegExp(name, "i") }, //make case-insensitive queries
  }).lean();
};
//#endregion

const Role = mongoose.model("roles", roleSchema);
export default Role;
