import mongoose from "mongoose";
import encryptHelper from "../utils/encrypt.helper.js";
import { ROLE } from "../constant/role.js";
import { ACCOUNT_STATUS } from "../constant/enumAccountStatus.js";
import { crossCutting } from "../utils/crossCutting.js";
import bcrypt from "bcrypt";

//Define collection and schema for Business
var userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: crossCutting.uuidv4() },
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
    status: {
      type: String,
      enum: {
        values: [
          ACCOUNT_STATUS.ACTIVE.TEXT,
          ACCOUNT_STATUS.PENDING.TEXT,
          ACCOUNT_STATUS.LOCKED.TEXT,
          ACCOUNT_STATUS.DISABLED.TEXT,
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
    oneTimePassword: {
      type: Boolean,
    },
    loginAttemptCount: { type: Number, default: 0 },
    secret_2fa: {
      type: String,
    },
    detailInfos: {
      type: Object,
      firstName: { type: String },
      lastName: { type: String },
      avatarPath: { type: String },
      aliasName: { type: String },
      showAlias: { type: Boolean, default: false },
      country: { type: String },
      birthday: { type: Date },
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
userSchema.query.byFilter = function (filterInfos) {
  return this.find(filterInfos).lean();
};

userSchema.query.byUsername = function (username) {
  return this.where({ username: username });
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

//#region middleware
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
//#endregion

const User = mongoose.model("users", userSchema);
export default User;
