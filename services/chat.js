import { helpersExtension } from "./../utils/helpersExtension.js";
import encryptHelper from "./../utils/encrypt.helper.js";

export default class ChatService {
  static responseMessage = (data) => {
    // decrypt data using
    const dataReceived = encryptHelper.aes.decrypt(data);
    const { message, postedOn, userInfo } = dataReceived;
    const showAlias = userInfo?.detailInfos?.showAlias ?? false;

    return {
      _id: dataReceived._id,
      socketId: dataReceived.socketId,
      message: message,
      username: userInfo.username,
      postedOn: postedOn,
      displayName: showAlias
        ? userInfo.detailInfos.aliasName
        : userInfo.detailInfos.firstName + " " + userInfo.detailInfos.lastName,
    };
  };
}
