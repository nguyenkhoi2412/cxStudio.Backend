import mongoose from "mongoose";
import { crossCutting } from "../utils/crossCutting.js";

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
      type: Number,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "industries",
  }
);

const Industry = mongoose.model("industries", industriesSchema);
export default Industry;
