import mongoose from 'mongoose';
import { crossCutting } from '../utils/crossCutting.js';

//Define collection and schema for Business
var logtimeSchema = new mongoose.Schema(
  {
    _id: { type: String, default: crossCutting.generate.uuidv4() },
    user_ref: { type: String, ref: 'users' },
    type: {
      type: Number,
      enum: {
        values: [
          1 //* use for every login
        ],
        message: '{VALUE} is not supported.'
      },
      required: true,
      default: 1
    },
    logs: [
      {
        _id: { type: String, default: crossCutting.generate.uuidv4() },
        timelog: { type: Date }
      }
    ]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  },
  {
    collection: 'logtimes'
  }
);

//#region queries
logtimeSchema.query.byFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
};

logtimeSchema.query.byUserId = function (userId, type = 1) {
  return this.where({ user_ref: userId, type: type }); // if use lean(), you can't use methods in this modal
};
//#endregion

//#region methods
//#endregion

//#region middleware
//#endregion

const Logtime = mongoose.model('logtimes', logtimeSchema);
export default Logtime;
