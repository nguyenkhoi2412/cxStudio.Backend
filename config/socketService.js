import { Server } from "socket.io";

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
      console.log(`⚡: ${socket.id} user just connected!`);

      // MESSAGE
      socket.on("message", (data) => {
        console.log('message', data);
        io.emit("messageResponse", data);
      });

      // TYPEING
      socket.on("typing", (data) => {
        console.log('typing', data);
        socket.broadcast.emit("typingResponse", data);
      });

      // NEWUSER
      socket.on("newUser", (data) => {
        users.push(data);
        console.log("newUser", data);
        io.emit("newUserResponse", users);
      });

      // DISCONNECT
      socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
        users = users.filter((user) => user.socketID !== socket.id);
        io.emit("newUserResponse", users);
        socket.disconnect();
      });
    });
  },
};

export default SocketService;
