const express = require("express");
const authRoute = express.Router();
const AuthController = require("./auth.controller");

authRoute.get("/login", AuthController.renderLogin);
authRoute.get("/register", AuthController.renderRegister);
authRoute.post("/login", AuthController.login);
authRoute.post("/register", AuthController.register);
authRoute.post("/refresh-token", AuthController.refreshToken);

module.exports = authRoute;
