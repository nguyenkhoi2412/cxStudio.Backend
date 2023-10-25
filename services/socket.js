import { Server } from "socket.io";

const _liveChat = "liveChat__";

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
      socket.on(_liveChat + "message", (data) => {
        console.log("message", data);
        io.emit(_liveChat + "messageResponse", data);
      });

      // TYPING
      socket.on(_liveChat + "typing", (data) => {
        console.log("typing", data);
        socket.broadcast.emit(_liveChat + "typingResponse", data);
      });

      // NEWUSER
      socket.on(_liveChat + "join", (data) => {
        users.push(data);
        io.emit(_liveChat + "joinResponse", users);
      });

      // DISCONNECT
      socket.on("disconnect", () => {
        // const userDisconnected = users.filter(
        //   (user) => user.socketId === socket.id
        // );
        // console.log(
        //   "🔥: " +
        //     userDisconnected[0]?.currentUser.detailInfos.aliasName +
        //     " (" +
        //     userDisconnected[0]?.currentUser.email +
        //     ")" +
        //     " disconnected"
        // );
        users = users.filter((user) => user.socketId !== socket.id);
        io.emit(_liveChat + "joinResponse", users);
        socket.disconnect();
      });
      //#endregion
    });
  },
};

export default SocketService;
