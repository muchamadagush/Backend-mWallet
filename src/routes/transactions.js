const express = require('express');
const router = express.Router();
const transactionRoutes = require('../controllers/trasactions');


router
  .get('/history', transactionRoutes.history)

module.exports = router