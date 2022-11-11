const User = require("../database/model/User");

class UserController {
  async getUser(email) {
    return await User.findOne({ email: email });
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (e) {
      return false;
    }
  }

  async createUser(data) {
    const newUser = new User(data);
    return await newUser.save();
  }

  async getAllUsersWithoutMe(myId) {
    return await User.find({ _id: { $ne: myId } });
  }

  async updateRefreshToken(email, refreshToken) {
    return await User.findOneAndUpdate(
      { email: email },
      { refreshToken: refreshToken }
    );
  }
}

module.exports = new UserController();
