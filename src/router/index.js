const express = require('express')
const router = express.Router()
// const transactionsRouter = require('./transactions')
const usersRouter = require('./users')
// const multer = require('../middlewares/multer')
// app.use('/products', productRouter)
// app.use('/users', userRouter)
router
  // .use('/transactions', transactionsRouter)
  .use('/users', usersRouter)

module.exports = router