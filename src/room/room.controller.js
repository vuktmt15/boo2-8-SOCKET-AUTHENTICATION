const Room = require("../database/model/Room");

class RoomController {
  async getRoom(member_1, member_2) {
    return await Room.findOne().or([
      { member_1: member_1, member_2: member_2 },
      { member_1: member_2, member_2: member_1 },
    ]);
  }

  async startRoom(member_1, member_2) {
    const newRoom = new Room({ member_1: member_1, member_2: member_2 });
    return await newRoom.save();
  }
}

module.exports = new RoomController();
