const express = require("express");
const bcrypt = require("bcryptjs");
const { User, createUserSchema, updateUserSchema } = require("../Models/user");

const router = express.Router();

//endpoint : /users POST
router.post("/", async (req, res) => {
  try {
    const validationResult = createUserSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(422).send({
        message: "Validation fail",
        data: validationResult.error.details
      });
    }

    const { name, email, password, avatar = "" } = req.body;
    //hash password
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashPassword,
      avatar
    });

    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

//endpoint : /users PATCH
router.patch("/:id", async (req, res) => {
  try {
    const validateResult = updateUserSchema.validate();
    if (validateResult.error) {
      return res.status(422).send({
        message: "Validation fail",
        data: validateResult.error.error.details
      });
    }

    const userId = req.params.id;
    const updateFields = Object.keys(req.body);
    const allowUpdateField = ["name", "email", "avatar"];
    const canUpdate = updateFields.every(item =>
      allowUpdateField.includes(item)
    );
    if (!canUpdate) {
      return res
        .status(400)
        .send({ message: "Some fields are not allowed to update!" });
    }
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//endpoint : /users GET
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

//endpoint : /users/id GET
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

//endpoint : /users/id DELETE
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
