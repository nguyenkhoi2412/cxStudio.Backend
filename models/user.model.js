import mongoose from "mongoose";
import encryptHelper from "../utils/encrypt.helper.js";
import { ROLE } from "../constant/enumRoles.js";
import { helpersExtension } from "../utils/helpersExtension.js";
import bcrypt from "bcrypt";

//Define collection and schema for Business
var userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: helpersExtension.uuidv4() },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: [
          ROLE.ADMIN.name,
          ROLE.SUPERVISOR.name,
          ROLE.USER.name,
          ROLE.VISITOR.name,
        ],
        message: "{VALUE} is not supported.",
      },
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    isLock: {
      type: Boolean,
    },
    oneTimePassword: {
      type: Boolean,
    },
    secret_2fa: {
      type: String,
    },
    detailInfos: {
      type: Object,
      firstname: { type: String },
      lastname: { type: String },
      avatarPath: { type: String },
    },
    site_ref: { type: String, ref: "sites" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
  {
    collection: "users",
  }
);

//#region queries
userSchema.query.findByFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
};

userSchema.query.findByUsername = function (username) {
  return this.where({ username: username });
};

userSchema.query.findById = function (id) {
  return this.where({ _id: id });
};
//#endregion

//#region methods
// check compare password with bcrypt
userSchema.methods.verifyPassword = function (
  password,
  decryptCryptoJs = true
) {
  // decrypt password using cryptoJs
  const pwd = decryptCryptoJs ? encryptHelper.rsa.decrypt(password) : password;
  //encrypt password to get data
  return bcrypt.compareSync(pwd, this.password);
};
//#endregion

//hashing a password before saving it to the database
userSchema.pre("save", function (next) {
  var user = this;
  var password = encryptHelper.rsa.decrypt(user.password);
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", userSchema);
export default User;
