const express = require('express');
const router = express.Router();
const transactionRoutes = require('../controllers/transactions.js')
const auth = require('../middlewares/auth')

router
  .get('/', auth.verifyAccess, transactionRoutes.getAllTransactions)
  .post('/', auth.verifyAccess, transactionRoutes.transaction)
  .get('/:id', auth.verifyAccess, transactionRoutes.detailTransaction)
  .get('/history/:userId', auth.verifyAccess, transactionRoutes.history)
  .post('/addvirtualaccount', transactionRoutes.createVirtualAccount)
  .post('/topup', transactionRoutes.topup)
  .get('/va/:userId', auth.verifyAccess, transactionRoutes.getVAUser)

module.exports = router