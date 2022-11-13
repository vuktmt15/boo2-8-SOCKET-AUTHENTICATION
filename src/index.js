const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const db = require("./database/connect.js");
const authRoute = require("./auth/auth.routes");
const messageRoute = require("./message/message.routes.js");
const MessageController = require("./message/message.controller");

dotenv.config({ path: "./.env" });

db.connect();

app.use("/", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/", authRoute);
app.use("/", messageRoute);

io.on("connection", function (socket) {
  console.log("Client connected...");
  socket.on("send message", async (data) => {
    io.emit("send message", data);
    await MessageController.saveMessages(data);
  });
  socket.on("disconnect", () => {});
});

server.listen(process.env.PORT, () => {
  console.log("Listen on port: http://localhost:" + process.env.PORT);
});
