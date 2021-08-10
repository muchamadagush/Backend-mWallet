const express = require('express')
require('dotenv').config()
const app = express()
// const bodyParser = require('body-parser')
const usersRouter = require('./src/router/users')
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
// const setCors = require('./src/middlewares/cors')
const createError = require('http-errors')
// const { route } = require('./src/router/product')
const router = require('./src/router')

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.use('/v1', router)

app.use('*', (req, res, next) => {
  const error = new createError.NotFound()
  next(error)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "internal server Error",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
