const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')

router
  .get('/', usersController.getAllUsers)
  .get('/:id', usersController.getUsersById)
  // .post('/', usersController.insertUsers)
  .patch('/:id', usersController.updateUsers)
  .delete('/:id', usersController.deleteUsers)

module.exports = router