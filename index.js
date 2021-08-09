const express = require('express')
require('dotenv').config()
const app = express()
const usersRouter = require('./src/router/users')
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const createError = require('http-errors')
const router = require('./src/router')
const path = require('path')

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(morgan('dev'))
app.use(cors())

app.use('/v1', router)
app.use('/file', express.static('./images'))


app.use('*', (req, res, next) => {
  const error = new createError.NotFound()
  next(error)
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'internal server Error'
  })
})

app.listen(4000, () => {
  console.log('server is running on port 4000')
})
