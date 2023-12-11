import asyncHandler from "express-async-handler";
import { ROLE } from "#constant/enumRoles";
import User from "#models/user.model";
import { helpersExtension } from "../utils/helpersExtension.js";
import { TEMPLATES } from "#shared/templates";
import encryptHelper from "../utils/encrypt.helper.js";
import transportHelper from "../utils/transport.helper.js";
import response from "../utils/response.helper.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "#constant/httpStatus";
import bcrypt from "bcrypt";
import UserService from "#services/user";

const expired = 60 * 60; // 1 hours

export default {};
