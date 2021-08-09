const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.js')

router
  .get('/', usersController.getAllUsers)
  .get('/:id', usersController.getUsersById)
  .patch('/:id', usersController.updateUsers)
  .delete('/:id', usersController.deleteUsers)

module.exports = router