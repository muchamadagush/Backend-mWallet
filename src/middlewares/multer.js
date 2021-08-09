const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname)
  }

})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(new Error('only png and jpg ext allowed'))
  }
}

const images = multer({

  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20000000
  }
})

module.exports = images
