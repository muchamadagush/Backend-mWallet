const express = require("express");
const router = express.Router();
const userController = require("../controllers/userAuth.js");

router
  .post("/register", userController.register)
  .post("/login", userController.login)
  .get("/activation/:token", userController.activation)
  .post("/setpin/:id", userController.setPin);

module.exports = router;
