const UserController = require("../users/users.controller");

class MessageController {
  async renderMessage(req, res) {
    const user = req.user;
    const restUsers = UserController.getAllUsersWithoutMe(user._id);

    return res.render("chat", { user: user, restUsers: restUsers });
  }
}

module.exports = new MessageController();
