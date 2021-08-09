const express = require("express");
const router = express.Router();
const userController = require("../controllers/userAuth");

router
  .post("/register", userController.register)
  .post("/login", userController.login)
  .get("/activation/:token", userController.activation)
  .post("/setpin", userController.setPin)
  .get("/forgotpassword", userController.forgotPassword)
  .post("/resetpassword/:token", userController.resetPassword);

module.exports = router;
