const express = require('express');
const router = express.Router();
const userAuthRouter = require("./userAuth");

router.use("/", userAuthRouter);

// routes
const transactionRoutes = require('./transactions');

router
  .use('/transactions', transactionRoutes)

module.exports = router