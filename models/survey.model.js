import mongoose from "mongoose";

var Schema = mongoose.Schema;

//Define collection and schema for Business
var surveySchema = new Schema(
  {
    _id: { type: String },
    title: { type: Object },
    sub_title: { type: Object },
    desc: { type: Object },
    start_date: { type: Date },
    end_date: { type: Date },
    duration: { type: Number },
    categories_ref: [{ type: String, ref: "categories" }],
    type_ref: { type: String, ref: "types" },
    site_ref: { type: Number, ref: "sites" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "surveys",
  }
);

//#region queries
surveySchema.query.findByFilter = function (filterInfos) {
  return this.find(filterInfos)
    .lean()
    .populate("categories_ref", "title desc")
    .populate("type_ref", "name");
};
//#endregion

const Survey = mongoose.model("surveys", surveySchema);
export default Survey;
