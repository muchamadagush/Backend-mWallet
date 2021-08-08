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
// app.use(setCors())
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE') // If needed
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type') // If needed
//   res.setHeader('Access-Control-Allow-Credentials', true) // If needed
//   next()
// })
// app.use(morgan('dev'))

app.use('/v1', router)
// app.use('/file', express.static('./images'))

// app.use('/product', productRouter)
// app.use('/user', userRouter)
// app.use('/history', historyRouter)
// app.use('/category', categoryRouter)

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
