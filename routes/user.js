const express = require("express");
const userController = require("../Controllers/user");
const { authenticate, authorize } = require("../Middlewares/auth");

const router = express.Router();

//endpoint : /users POST
router.post("/", userController.createUser);

//endpoint : /users PATCH
router.patch("/:id", authenticate, userController.updateUserById);

//endpoint : /users GET
router.get("/", authenticate, authorize(["admin"]), userController.getUsers);

//endpoint : /users/id GET
router.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  userController.getUserById
);

//endpoint : /users/id DELETE
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  userController.deleteUserById
);

//endpoint : /users/login
router.post("/login", userController.login);

module.exports = router;
