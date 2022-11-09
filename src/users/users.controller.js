const User = require("../database/model/User");

class UserController {
  async getUser(email) {
    return await User.findOne({ email: email });
  }

  async createUser(data) {
    const newUser = new User(data);
    return await newUser.save();
  }

  async updateRefreshToken(email, refreshToken) {
    return await User.findOneAndUpdate(
      { email: email },
      { refreshToken: refreshToken }
    );
  }
}

module.exports = new UserController();
