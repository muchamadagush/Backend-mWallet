const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.js')
const auth = require('../middlewares/auth')

router
  .get('/', auth.verifyAccess, usersController.getAllUsers)
  .get('/:id', auth.verifyAccess, usersController.getUsersById)
  .patch('/:id', auth.verifyAccess, usersController.updatePhoneUsers)
  .patch('/avatar/:id', auth.verifyAccess, usersController.updateAvatarUsers)
  .patch('/password/:email', usersController.updatePasswordUsers)
  .delete('/:id', auth.verifyAccess, usersController.deleteUsers)

module.exports = router