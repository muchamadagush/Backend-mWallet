const express = require('express');
const router = express.Router();

// routes
const transactionRoutes = require('./transactions');

router
  .use('/transactions', transactionRoutes)

module.exports = router