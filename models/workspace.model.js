import mongoose from "mongoose";
import { ROLE } from "../constant/role.js";
import { helpersExtension } from "../utils/helpersExtension.js";

//Define collection and schema for Business
var workspaceSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    site_id: { type: String, required: true },
    name: {
      type: Object, //! DATATYPES
      lowercase: true,
      trim: true,
      required: true,
    },
    logoPath: { type: String },
    team_members: {
      type: Array, //! DATATYPES
      // _id: String,
      // email: String,
      ref: "users",
      role: {
        type: String, //! DATATYPES
        enum: {
          values: [
            ROLE.ADMIN.name,
            ROLE.SUPERVISOR.name,
            ROLE.USER.name,
            ROLE.VISITOR.name,
          ],
          message: "{VALUE} is not supported.",
        },
      },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "workspaces",
  }
);

//#region queries
workspaceSchema.query.byFilter = function (filterInfos) {
  return this.find(filterInfos).lean().populate("team_members", "_id email");
};

workspaceSchema.query.findBySite = function (siteId) {
  return this.find({
    site_id: siteId,
  })
    .lean()
    .populate("team_members", "_id email");
};

workspaceSchema.query.findBySite = function (siteId) {
  return this.find({
    site_id: siteId,
  })
    .lean()
    .populate("team_members", "_id email");
};
//#endregion

const Type = mongoose.model("types", workspaceSchema);
export default Type;
