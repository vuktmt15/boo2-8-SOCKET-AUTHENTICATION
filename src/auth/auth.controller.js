const UserController = require("../users/users.controller");
const bcrypt = require("bcrypt");
const randToken = require("rand-token");

class AuthController {
  async renderRegister(req, res) {
    res.render("register");
  }

  async renderLogin(req, res) {
    res.render("login");
  }

  async register(req, res) {
    const checkExists = await UserController.getUser(req.body.email);
    if (checkExists) {
      return res.redirect("back", { error: "Email already exists!" });
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
        return res.redirect("back", { error: "Registration Failed!" });
      }
      return res.redirect("/login", { registered: true });
    }
  }

  async login(req, res) {
    const user = await UserController.getUser(req.email);
    if (!user) {
      return res.redirect("back", { error: "Account does not exist!" });
    }

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.redirect("back", { error: "Password is not valid!" });
    }

    const accessToken = await AuthMethod.generateToken(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE
    );
    if (!accessToken) {
      return res.redirect("back", { error: "Login Failed!" });
    }

    let refreshToken = randToken.generate(
      parseInt(process.env.REFRESH_TOKEN_SIZE)
    );
    if (!user.refreshToken) {
      await UserController.updateRefreshToken(user.email, refreshToken);
    } else {
      refreshToken = user.refreshToken;
    }

    res.redirect("/", { user: user, accessToken, refreshToken });
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
