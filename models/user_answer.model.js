import mongoose from "mongoose";
var Schema = mongoose.Schema;

//Define collection and schema for Business
var userAnswerSchema = new Schema(
  {
    _id: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    birthday: { type: Date },
    test: [
      {
        _id: { type: String },
        category_id: { type: String }, //* _id from categories
        name: { type: String }, //* name from categories
        start_date: { type: Date },
        duration: { type: Number }, //* 30
        finish_time: { type: Number }, //* time duration for test
        complete: { type: Boolean },
        answers: [
          {
            _id: { type: String },
            questionaire: { type: String, ref: "questions" }, //? ref to questions infos
            selection: { type: Array }, //? user's selection, maybe true/false or text string
          },
        ],
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "user_answers",
  }
);

//#region queries
userAnswerSchema.query.findByEmail = function (email) {
  return this.where({ email: email });
};

userAnswerSchema.query.findByFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
};
//#endregion

const UserAnswer = mongoose.model("user_answers", userAnswerSchema);
export default UserAnswer;
