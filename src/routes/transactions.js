const express = require('express');
const router = express.Router();
const transactionRoutes = require('../controllers/transactions.js');


router
  .get('/history', transactionRoutes.history)

module.exports = router