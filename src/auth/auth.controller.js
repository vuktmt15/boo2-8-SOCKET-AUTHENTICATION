const UserController = require("../users/users.controller");
const AuthMethod = require("./auth.methods");
const bcrypt = require("bcrypt");
const randToken = require("rand-token");
const { errorAuth } = require("./message/auth.error");
const { notificationAuth } = require("./message/auth.notification");

class AuthController {
  async renderRegister(req, res) {
    return res.render("register", {
      messageError: errorAuth,
      messageNotification: notificationAuth,
      error: req.query.error ?? false,
      notification: req.query.notification ?? false,
    });
  }

  async renderLogin(req, res) {
    if (req.cookies.accessToken) {
      return res.redirect("/");
    }
    return res.render("login", {
      messageError: errorAuth,
      messageNotification: notificationAuth,
      error: req.query.error ?? false,
      notification: req.query.notification ?? false,
    });
  }

  async register(req, res) {
    const checkExists = await UserController.getUser(req.body.email);
    if (checkExists) {
      return res.redirect("/register?error=4");
    } else {
      const hashPassword = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALT_ROUNDS)
      );
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      };
      const createUser = await UserController.createUser(newUser);
      if (!createUser) {
        return res.redirect("register?error=5");
      }
      return res.redirect("/login?notification=0");
    }
  }

  async login(req, res) {
    const user = await UserController.getUser(req.body.email);
    if (!user) {
      return res.redirect("/login?error=1");
    }

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      console.log("Password is not valid");
      return res.redirect("/login?error=2");
    }

    const accessToken = await AuthMethod.generateToken(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE
    );
    if (!accessToken) {
      console.log("Access token is not valid");
      return res.redirect("/login?error=3");
    }

    let refreshToken = randToken.generate(
      parseInt(process.env.REFRESH_TOKEN_SIZE)
    );
    if (!user.refreshToken) {
      await UserController.updateRefreshToken(user.email, refreshToken);
    } else {
      refreshToken = user.refreshToken;
    }
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 15, // 15 minutes
      path: "/",
      secure: false,
    });
    res.redirect("/");
  }

  async refreshToken(req, res) {
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
      return res.status(404).send("Access token does not exist");
    }

    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
      return res.status(400).send("Refresh token does not exist");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

    //check old token
    const decoded = await AuthMethod.decodeToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    if (!decoded) {
      return res.status(400).send("Access token is not valid");
    }

    const email = decoded.payload.email;

    const user = await userModel.getUser(email);
    if (!user) {
      return res.status(404).send("User does not exist");
    }

    if (refreshTokenFromBody !== user.refreshToken) {
      return res.status(400).send("Refresh token is not valid");
    }

    //Create a new access_token
    const dataForAccessToken = {
      username,
    };

    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken) {
      return res
        .status(400)
        .send("Created Access Token Failed, please try again!");
    }
    return res.json({
      accessToken,
    });
  }
}

module.exports = new AuthController();
