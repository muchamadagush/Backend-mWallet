const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const createError = require('http-errors')
const router = require('./src/routes')

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
