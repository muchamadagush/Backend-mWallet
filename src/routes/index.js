const express = require('express');
const router = express.Router();

// routes
const userAuthRouter = require("./userAuth");
const transactionRoutes = require('./transactions');
const userRouter = require('./users');

router
  .use('/transactions', transactionRoutes)
  .use('/users', userRouter)
  .use('/auth', userAuthRouter)

module.exports = router