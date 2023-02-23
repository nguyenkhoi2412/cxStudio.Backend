import mongoose from "mongoose";

var Schema = mongoose.Schema;

//Define collection and schema for Business
var supplierSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String },
    contact: { type: String },
    site_ref: { type: String, ref: "sites" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "suppliers",
  }
);

//#region queries
supplierSchema.query.findByFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
};
//#endregion

const Supplier = mongoose.model("suppliers", supplierSchema);
export default Supplier;
