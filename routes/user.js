const express = require("express");
const userController = require("../Controllers/user");

const router = express.Router();

//endpoint : /users POST
router.post("/", userController.createUser);

//endpoint : /users PATCH
router.patch("/:id", userController.updateUserById);

//endpoint : /users GET
router.get("/", userController.getUsers);

//endpoint : /users/id GET
router.get("/:id", userController.getUserById);

//endpoint : /users/id DELETE
router.delete("/:id", userController.deleteUserById);

//endpoint : /users/login
router.post("/login", userController.login);

module.exports = router;
