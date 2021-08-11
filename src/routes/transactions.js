const express = require('express');
const router = express.Router();
const transactionRoutes = require('../controllers/transactions.js')
const auth = require('../middlewares/auth')

router
  .post('/', auth.verifyAccess, transactionRoutes.transaction)
  .get('/history/:userId', auth.verifyAccess, transactionRoutes.history)
  .get('/:id', auth.verifyAccess, transactionRoutes.detailTransaction)
  .post('/addvirtualaccount', auth.verifyAccess, transactionRoutes.createVirtualAccount)
  .post('/topup', transactionRoutes.topup)

module.exports = router