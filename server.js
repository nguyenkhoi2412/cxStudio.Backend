import https from "https";
import http from "http";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Server } from "socket.io";
import csrf from "csurf";
import dbService from "./config/dbService.js";
import corsOptions from "./config/corsOptions.js";
import _apiRouters from "./_routes/_api.routes.js";
import { stringExtension } from "./utils/helpersExtension.js";

//dotenv config, read data in .env
dotenv.config();

const app = express();
//#region security
app.use(helmet());

//create https
const options = {
  key: fs.readFileSync("./cert/key.pem", "utf-8"),
  cert: fs.readFileSync("./cert/cert.pem", "utf-8"),
};
//#endregion

//#region CONNECT DATABASE
dbService.connect((err) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5009;
  const PORT_SOCKET = process.env.PORT_SOCKET || 5008;
  //Express js listen method to run project on https://e-gostore.vn:5009
  // app.listen(PORT, function () {
  //   console.log(`App is running mode on port ${PORT}`);
  // });
  // https.createServer(options, app).listen(PORT, function () {
  //   console.log(`App is running mode on port ${PORT}`);
  // });
  const server = http.createServer(app).listen(PORT, function () {
    console.log(`Server is successfully running...`);
    console.log(`App is listening on port ${PORT}`);
  });

  //#region CONNECTION SOCKET
  let users = [];
  const io = new Server(server);
  io.listen(PORT_SOCKET);

  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    // MESSAGE
    socket.on("message", (data) => {
      io.emit("messageResponse", data);
    });

    // TYPEING
    socket.on("typing", (data) =>
      socket.broadcast.emit("typingResponse", data)
    );

    // NEWUSER
    socket.on("newUser", (data) => {
      users.push(data);
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
  //#endregion

  app.get("/", (req, res, next) => {
    res.send("Server started\n");
  });
});
//#endregion

//#region Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
//#endregion

// handle request url
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({
      code: 405,
      ok: false,
      message: `Method ${req.method} not allowed.`,
    });
  }

  // remove xss from url
  // req.getUrl = function () {
  //   return stringExtension.stripedHtml(
  //     req.protocol + "://" + req.get("host") + req.originalUrl
  //   );
  // };

  return next();
});

// // Logging the rejected field from multer error
// app.use((error, req, res, next) => {
//   console.log('This is the rejected field ->', error.field);
// });

//Request API for clients callback
_apiRouters(app);
