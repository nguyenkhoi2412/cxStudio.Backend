import mongoose from "mongoose";

var Schema = mongoose.Schema;

//Define collection and schema for Business
var articleSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: Object, trim: true },
    sub_title: { type: Object, trim: true },
    desc: { type: Object },
    sort_no: { type: Number },
    barcode: { type: String },
    image: {
      type: Array, //! DATATYPE
      url: { type: String },
      active: { type: Boolean },
    },
    properties: {
      type: Object, //! DATATYPE
      quantity: { type: String },
      unit: { type: Object },
      purchase_price: { type: Object },
      sale_price: { type: Object },
    },
    supplier_ref: { type: String, ref: "suppliers" },
    categories_ref: { type: String, ref: "categories" },
    type_ref: { type: String, ref: "types" },
    site_ref: { type: String, ref: "sites" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "articles",
  }
);

//#region queries
articleSchema.query.byFilter = function (filterInfos) {
  return this.find(filterInfos)
    .sort({ title: 1 })
    .lean()
    .populate("suppliers_ref", "name")
    .populate("categories_ref", "title")
    .populate("type_ref", "name");
};

articleSchema.query.findByCategory = function (category_ref) {
  return this.find({
    category_ref: category_ref,
  })
    .sort({ title: 1 })
    .lean()
    .populate("suppliers_ref", "name")
    .populate("categories_ref", "title")
    .populate("type_ref", "name");
};

articleSchema.query.findBySupplier = function (supplier_ref) {
  return this.find({
    supplier_ref: supplier_ref,
  })
    .sort({ title: 1 })
    .lean()
    .populate("suppliers_ref", "name")
    .populate("categories_ref", "title")
    .populate("type_ref", "name");
};
//#endregion

const Article = mongoose.model("articles", articleSchema);
export default Article;
