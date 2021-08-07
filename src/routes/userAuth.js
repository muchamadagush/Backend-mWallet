const express = require("express");
const router = express.Router();
const userController = require("../controllers/userAuth");

router
  .post("/register", userController.register)


module.exports = router;
