import mongoose from "mongoose";

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
    company: {
      type: Object, //! DATATYPES
      trim: true,
      required: true,
    },
    logo_path: { type: String },
    owner: {
      type: String,
      ref: "users",
    },
    team_members: [
      {
        type: String,
        ref: "users",
      },
    ],
    is_active: {
      type: Boolean, //! DATATYPES
      default: true,
      default: "default",
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
  return this.find(filterInfos)
    .lean()
    .populate({ path: "team_members", select: "_id email detailInfos" })
    .populate({ path: "owner", select: "_id email detailInfos" });
};

workspaceSchema.query.bySite = function (siteId) {
  return this.find({
    site_id: siteId,
  })
    .lean()
    .populate({ path: "team_members", select: "_id email detailInfos" })
    .populate({ path: "owner", select: "_id email detailInfos" });
};
//#endregion

//#region use middleware
//#endregion

const Workspace = mongoose.model("workspaces", workspaceSchema);
export default Workspace;
