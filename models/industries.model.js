import mongoose from 'mongoose';

//Define collection and schema for Business
var industriesSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
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
    type: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
  {
    collection: 'industries',
  },
);

const Industry = mongoose.model('industries', industriesSchema);
export default Industry;
