const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const createError = require('http-errors')
const router = require('./src/routes')

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors())
app.use(fileUpload());
app.use('/files', express.static(__dirname + '/src/assets/images'))
app.use('/v1', router)

app.use('*', (req, res, next) => {
  const error = new createError.NotFound()
  next(error)
})

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
