const UserController = require("../users/users.controller");
const RoomController = require("../room/room.controller");
const Message = require("../database/model/Message");

class MessageController {
  async saveMessages(data) {
    const newMessage = new Message(data);
    if (!(await RoomController.getRoom(data.sender, data.receiver))) {
      await RoomController.startRoom(data.sender, data.receiver);
    }
    return await newMessage.save();
  }

  async getMessages(member_1, member_2) {
    return await Message.find().or([
      { receiver: member_1, sender: member_2 },
      { receiver: member_2, sender: member_1 },
    ]);
  }

  async renderMessage(req, res) {
    const _this = new MessageController();
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
      messages = await _this.getMessages(user._id, friend._id);
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
