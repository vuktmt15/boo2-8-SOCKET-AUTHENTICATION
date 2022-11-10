const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const db = require("./database/connect.js");
const authRoute = require("./auth/auth.routes");
const messageRoute = require("./message/message.routes.js");

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

app.listen(process.env.PORT, () => {
  console.log("Listen on port: http://localhost:" + process.env.PORT);
});
