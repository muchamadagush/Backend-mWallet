const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.js')

router
  .get('/', usersController.getAllUsers)
  .get('/:id', usersController.getUsersById)
  .patch('/:id', usersController.updatePhoneUsers)
  .patch('/avatar/:id', usersController.updateAvatarUsers)
  .patch('/password/:email', usersController.updatePasswordUsers)
  .delete('/:id', usersController.deleteUsers)

module.exports = router