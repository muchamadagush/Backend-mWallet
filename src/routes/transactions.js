const express = require('express');
const router = express.Router();
const transactionRoutes = require('../controllers/transactions.js');

router
  .post('/', transactionRoutes.transaction)
  .get('/history', transactionRoutes.history)

module.exports = router