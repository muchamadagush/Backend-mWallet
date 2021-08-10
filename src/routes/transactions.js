const express = require('express');
const router = express.Router();
const transactionRoutes = require('../controllers/transactions.js')

router
  .post('/', transactionRoutes.transaction)
  .get('/history/:userId', transactionRoutes.history)
  .get('/:id', transactionRoutes.detailTransaction)
  .post('/addvirtualaccount', transactionRoutes.createVirtualAccount)
  .post('/topup', transactionRoutes.topup)

module.exports = router