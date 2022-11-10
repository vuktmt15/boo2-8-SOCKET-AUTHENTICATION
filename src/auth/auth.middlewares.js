const UserController = require("../users/users.controller");

const authMethod = require("./auth.methods");

class AuthMiddleware {
  async isAuth(req, res, next) {
    const accessTokenFromHeader = req.cookies.accessToken;
    if (!accessTokenFromHeader) {
      return res.redirect("/login?error=0");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    if (!verified) {
      return res.redirect("/login?error=0");
    }

    const user = await UserController.getUser(verified.payload.email);
    req.user = user;

    return next();
  }
}

module.exports = new AuthMiddleware();
