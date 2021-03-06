const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const config = require("../config")

const authenticate = async (req, res, next) => {
  const tokenStr = req.get("Authorization");
  if (!tokenStr) {
    return res.status(400).send({ message: "No token provider" });
  }
  const token = tokenStr.split(" ")[1];
  try {
    const decodeToken = jwt.verify(token, config.secretKey);
    const existedUser = await User.findById(decodeToken.userId);
    if (!existedUser) {
      return res.status(401).send({ message: "Permission deny" });
    }
    req.userId = existedUser._id;
    req.userEmail = existedUser.email;
    req.userRole = existedUser.role;
    next();
  } catch (e) {
    return res.status(401).send({ message: "Permission deny", data: e });
  }
};

const authorize = accessRole => {
  return async (req, res, next) => {
    try {
      let canAccess = false;
      req.userRole.forEach(item => {
        if (accessRole.includes(item)) {
          canAccess = true;
        }
      });
      if (!canAccess) {
        return res.status(401).send({ message: "Permission deny" });
      }
      next();
    } catch (e) {
      return res.status(500).send();
    }
  };
};

module.exports = { authenticate, authorize };
