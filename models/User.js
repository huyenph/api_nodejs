const mongoose = require("mongoose");
const validator = require("validator");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  avatar: {
    type: String
  }
});

const createUserSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(8)
    .max(16),
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string().required(),
  avatar: Joi.string()
    .required()
    .uri()
});

const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(8)
    .max(16),
  email: Joi.string()
    .email(),
  avatar: Joi.string()
    .uri()
});

const User = mongoose.model("User", userSchema);

module.exports = { User, createUserSchema, updateUserSchema };
