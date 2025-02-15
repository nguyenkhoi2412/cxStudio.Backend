import Logtime from '../models/logtimes.model.js';
import CommonService from './_common.service.js';
import { crossCutting } from '../utils/crossCutting.js';

class LogService extends CommonService {
  /**
   * findByUserId with type
   * @param {*} userId have must _id
   * @param {*} type use for log many things, default is 1 use for login
   * @returns
   */
  static findByUserId = async (userId, type = 1) => {
    return new Promise((resolve) => {
      Logtime.findOne()
        .byUserId(userId, type)
        .then((user) => {
          resolve(user);
        });
    });
  };

  static addLogsUserLogin = async (userId) => {
    this.addLogs(userId, 1);
  };

  /**
   * addLogs when user login
   * @param {*} userId
   * @param {*} type use for log many things, default is 1 use for login
   */
  static addLogs = async (userId, type = 1) => {
    if (process.env.ALLOWED_LOG === "false") {
      return null;
    }

    return new Promise(async (resolve) => {
      this.findByUserId(userId, type).then(async (rsValue) => {
        //* insert new logs if has no value
        if (!rsValue) {
          const ModelSchema = new Logtime({
            // _id: crossCutting.generate.uuidv4(),
            user_ref: userId,
            type: type,
            logs: [
              {
                timelog: new Date()
              }
            ]
          });

          // save
          const saved = await ModelSchema.save();
          resolve(saved);
        } else {
          //* add timelog every user signin again
          var newValueUpdate = {
            logs: [
              ...rsValue.logs,
              {
                timelog: new Date()
              }
            ]
          };

          var filter = { _id: rsValue._id };
          var updateValues = { $set: newValueUpdate };

          // Save update
          Logtime.findOneAndUpdate(filter, updateValues, {
            upsert: true,
            new: true,
            returnNewDocument: true
          }).then((rs) => {
            resolve(rs);
          });
        }
      });
    });
  };
}

export default LogService;
