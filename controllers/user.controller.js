import asyncHandler from "express-async-handler";
import { ROLE } from "../constant/role.js";
import User from "../models/user.model.js";
import { crossCutting } from "../utils/crossCutting.js";
import { TEMPLATES } from "../shared/templates.js";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import response from "../utils/response.helper.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "../constant/httpStatus.js";
import bcrypt from "bcrypt";
import UserService from "../services/user.js";

const expired = 60 * 60; // 1 hours

export default {};
