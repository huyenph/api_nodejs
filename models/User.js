const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [8, "Name should at least 8 characters"],
    maxlength: [16, "Name should max 16 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid!");
      }
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  avatar: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
