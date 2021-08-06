const express = require('express');
const router = express.Router();
const userAuthRouter = require("./userAuth");

router.use("/", userAuthRouter);

module.exports = router