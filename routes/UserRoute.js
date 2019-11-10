const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

//endpoint : /users POST
router.post("/", async (req, res) => {
  try {
    const { name, email, password, avatar = "" } = req.body;

    //hash password
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashPassword,
      avatar
    });

    //validate before save user
    const error = user.validateSync();
    if (error) {
      return res.status(422).send(error);
    }
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
