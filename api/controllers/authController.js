const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: "No username or password" });

  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401);
  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60s", // access token expiration
      }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d", // refresh token expiration
      }
    );

    //Saving Refresh Token with the current user
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
