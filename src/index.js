const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const db = require("./database/connect.js");
const authRoute = require("./auth/auth.routes");

dotenv.config({ path: "./.env" });

db.connect();

app.use("/", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/", authRoute);

app.listen(process.env.PORT, () => {
  console.log("Listen on port: http://localhost:" + process.env.PORT);
});
