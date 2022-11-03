const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const emailLowercase = email.toLowerCase();
    const usernameLowercase = username.toLowerCase();

    //to refactor and also check if needed to be trimmed
    const emailExists = await User.exists({ email: emailLowercase });
    const userExists = await User.exists({ username: usernameLowercase });

    if (emailExists)
      return res.status(400).send("Email address already in use");
    if (userExists) return res.status(400).send("Username already in use");

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: emailLowercase,
      username: usernameLowercase,
      password: encryptedPassword,
    });

    //to refactor
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .send("An unexpected error occured. Please try again later." + err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //same as above
    const emailLowercase = email.toLowerCase();

    const user = await User.findOne({ email: emailLowercase });

    if (user && (await bcrypt.compare(password, user.password))) {
      //same as above
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        id: user._id,
        email: emailLowercase,
        username: user.username,
        token,
      });
    }

    res
      .status(400)
      .send(
        "This email and password combination is incorrect. Please try again."
      );
  } catch (err) {
    res
      .status(500)
      .send("An unexpected error occured. Please try again later." + err);
  }
};

module.exports = {
  login,
  register,
};
