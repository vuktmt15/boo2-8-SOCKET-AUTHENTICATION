const UserController = require("../users/users.controller");
const Message = require("../database/model/Message");

class MessageController {
  async renderMessage(req, res) {
    let messages = [];
    const user = req.user;
    const restUsers = await UserController.getAllUsersWithoutMe(user._id);
    let friend = await UserController.getUserById(req.query.friend);

    if (!friend) {
      if (restUsers.length > 0) {
        friend = restUsers[0];
      } else {
        friend = {};
      }
    }

    if (friend) {
      messages = await Message.find().or([
        { receiver: user._id, sender: friend._id },
        { receiver: friend._id, sender: user._id },
      ]);
    }

    return res.render("chat", {
      user: user,
      restUsers: restUsers.length > 0 ? restUsers : [],
      friend,
      messages: messages,
    });
  }
}

module.exports = new MessageController();
