import mongoose from "mongoose";
import { helpersExtension } from "#utils/helpersExtension";

var Schema = mongoose.Schema;

//Define collection and schema for Business
var questionSchema = new Schema(
  {
    _id: { type: String },
    title: { type: Object },
    sub_title: { type: Object },
    desc: { type: Object },
    sort_no: { type: Number, default: 0 },
    question_type: {
      type: Object, //! DATATYPES
      _id: { type: Number },
      text: { type: String },
    },
    marks: { type: Number, default: 1 },
    numberOfAnswers: { type: Number },
    answers: [
      {
        _id: { type: String, default: helpersExtension.uuidv4() },
        text: { type: Object },
        correct: { type: Boolean, default: false },
        desc: { type: Object },
      },
    ],
    categories_ref: { type: String, ref: "categories" },
    type_ref: { type: String, ref: "types" },
    site_ref: { type: Number, ref: "sites" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "questions",
  }
);

//#region queries
questionSchema.query.byFilter = function (filterInfos) {
  return this.find(filterInfos)
    .lean()
    .populate("categories_ref", "title")
    .populate("type_ref", "name");
};
//#endregion

questionSchema.pre("save", function (next) {
  var ques = this;
  ques.numberOfAnswers = ques.answers.length;
  next();
});

const Question = mongoose.model("questions", questionSchema);
export default Question;
