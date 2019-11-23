const bcrypt = require("bcryptjs");
const { User, createUserSchema, updateUserSchema } = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config")

const createUser = async (req, res) => {
  try {
    const validationResult = createUserSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(422).send({
        message: "Validation fail",
        data: validationResult.error.details
      });
    }

    const { name, email, password, avatar, role } = req.body;
    //hash password
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashPassword,
      avatar,
      role
    });

    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
};

const getUserById = async (req, res) => {
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
};

const deleteUserById = async (req, res) => {
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
};

const updateUserById = async (req, res) => {
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
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      existedUser.password
    );
    if (!isCorrectPassword) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    //create token
    const token = signToken({
      userId: existedUser._id,
      email: existedUser.email
    });
    res.status(200).send({ token });
  } catch (e) {
    res.status(500).send();
  }
};

const signToken = payload => {
  const token = jwt.sign(payload, config.secretKey, {
    expiresIn: config.jwtExpiredIn
  });
  return token;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  login
};
