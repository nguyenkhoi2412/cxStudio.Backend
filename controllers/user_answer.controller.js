import asyncHandler from "express-async-handler";
import UserAnswer from "../models/user_answer.model.js";
import moment from "moment";
import gVariables from "../shared/variables.js";
import { Helpers } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

export default {
  //validate function to retrieve user by username & password
  VALIDATE_USER: asyncHandler(async (req, res) => {
    // get user by email
    await UserAnswer.findOne()
      .findByEmail(req.body.email)
      .exec((err, user) => {
        if (err) {
          return res.status(401).json({
            code: 401,
            ok: false,
            message: err.message,
          });
        }

        if (!user) {
          // Insert new user
          var model = new UserAnswer(req.body);
          model._id = Helpers.uuidv4();
          model.birthday = moment(model.birthday).format(gVariables.dateFormat);

          // Save the new model instance, passing a callback
          model.save(function (err, result) {
            // saved!
            createToken(res, result, result.email);
          });
        } else {
          createToken(res, user, user.email);
        }
      });
  }),
};

const createToken = (res, user, dataSaveToken) => {
  const jwtToken = jwt.sign({ data: dataSaveToken }, process.env.JWT_TOKEN, {
    expiresIn: parseInt(process.env.TOKEN_EXPIRESIN), // 4 hours
  });

  // create refresh token
  const jwtRefreshToken = jwt.sign(
    { data: dataSaveToken },
    process.env.JWT_REFRESH_TOKEN,
    {
      expiresIn: parseInt(process.env.TOKEN_EXPIRESIN) * 6, // 24 hours
    }
  );

  res.status(200).json({
    code: 200,
    ok: true,
    message: "ok",
    rs: {
      userAnswer: {
        ...user.toJSON(),
      },
      access_token: jwtToken,
      refresh_token: jwtRefreshToken,
    },
  });
};
