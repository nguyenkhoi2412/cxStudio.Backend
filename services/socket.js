import { Server } from "socket.io";
import ChatService from "./chat.js";

const SocketService = {
  connect: (server) => {
    let users = [];
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      // console.log(`⚡: ${socket.id} just connected!`);

      //#region LIVE__CHAT
      // MESSAGE
      socket.on("liveChat__message", (data) => {
        const responseMessage = ChatService.responseMessage(data);
        io.emit("liveChat__messageResponse", responseMessage);
      });

      // TYPING
      socket.on("liveChat__typing", (data) => {
        console.log("typing", data);
        socket.broadcast.emit("liveChat__typingResponse", data);
      });

      // NEWUSER
      socket.on("liveChat__join", (data) => {
        users.push(data);
        io.emit("liveChat__joinResponse", users);
      });

      // DISCONNECT
      socket.on("disconnect", () => {
        const userDisconnected = users.filter(
          (user) => user.socketId === socket.id
        );
        console.log(
          "🔥: " +
            userDisconnected[0]?.currentUser.detailInfos.aliasName +
            " (" +
            userDisconnected[0]?.currentUser.email +
            ")" +
            " disconnected"
        );
        users = users.filter((user) => user.socketId !== socket.id);
        io.emit("liveChat__joinResponse", users);
        socket.disconnect();
      });
      //#endregion
    });
  },
};

export default SocketService;
