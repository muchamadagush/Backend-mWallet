const express = require('express');
const router = express.Router();
const transactionRoutes = require('../controllers/transactions');


router
  .post('/', transactionRoutes.transaction)
  .get('/history', transactionRoutes.history)
  .get('/:id', transactionRoutes.detailTransaction)

module.exports = router