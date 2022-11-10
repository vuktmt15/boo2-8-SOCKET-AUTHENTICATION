const userModle = require("../users/users.models");

const authMethod = require("./auth.methods");

class AuthMiddleware {
  async isAuth(req, res, next) {
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
      return res.status(401).send("Không tìm thấy access token!");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    if (!verified) {
      return res
        .status(401)
        .send("Bạn không có quyền truy cập vào tính năng này!");
    }

    const user = await userModle.getUser(verified.payload.username);
    req.user = user;

    return next();
  }
}

module.exports = new AuthMiddleware();
