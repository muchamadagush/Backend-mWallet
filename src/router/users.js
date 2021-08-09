const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const images = require('../middlewares/multer')

router
  .get('/', usersController.getAllUsers)
  .get('/:id', usersController.getUsersById)
  // .post('/', usersController.insertUsers)
  .patch('/:id', images.single('avatar'), usersController.updateUsers)
  .delete('/:id', usersController.deleteUsers)

module.exports = router