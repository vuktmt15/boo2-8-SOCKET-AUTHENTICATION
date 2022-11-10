const express = require("express");
const messageRoute = express.Router();
const MessageController = require("./message.controller");
const AuthMiddleware = require("../auth/auth.middlewares");

messageRoute.get("/", AuthMiddleware.isAuth, MessageController.renderMessage);

module.exports = messageRoute;
