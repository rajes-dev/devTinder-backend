const jwt = require("jsonwebtoken");
const user = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      throw new Error("token not valid..");
    }

    const verifyCookie = await jwt.verify(token, "DEV@Tinder@790");
    const { _id } = verifyCookie;

    const userObj = await user.findById(_id);
    if (!userObj) {
      throw new Error("user doesnt exist..");
    }

    req.user = userObj;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send("user not authenticated");
  }
};

module.exports = { userAuth };
