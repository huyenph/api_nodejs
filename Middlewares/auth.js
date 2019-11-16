const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authenticate = async (req, res, next) => {
  const tokenStr = req.get("Authorization");
  if (!tokenStr) {
    return res.status(400).send({ message: "No token provider" });
  }
  const token = tokenStr.split(" ")[1];
  console.log(token);
  try {
    const decodeToken = jwt.verify(token, "secret_key");
    console.log(decodeToken);
    const existedUser = await User.findOne(decodeToken.userId);
    if (!existedUser) {
      return res.status(401).send({ message: "Permission deny" });
    }
    req.userId = existedUser._id;
    
    next();
  } catch (e) {
    return res.status(401).send({ message: "Permission deny", data: e });
  }
};

module.exports = { authenticate };
