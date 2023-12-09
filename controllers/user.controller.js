import asyncHandler from "express-async-handler";
import { ROLE } from "#constant/enumRoles";
import User from "#models/user.model";
import { helpersExtension } from "#utils/helpersExtension";
import { TEMPLATES } from "#shared/templates";
import encryptHelper from "#utils/encrypt.helper";
import transportHelper from "#utils/transport.helper";
import response from "#utils/response.helper";
import jwt from "jsonwebtoken";
import { HTTP_STATUS as statusCodes } from "#constant/httpStatus";
import bcrypt from "bcrypt";
import UserService from "#services/user";

const expired = 60 * 60; // 1 hours

export default {};
