import mongoose from "mongoose";

//Define collection and schema for Business
var routepathSchema = new mongoose.Schema({
  axact: { type: Boolean },
  public: { type: Boolean },
  path: { type: String },
  component_import: { type: String },
});

const RoutePath = mongoose.model("routepath", routepathSchema);
export default RoutePath;
