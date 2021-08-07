require('dotenv').config()

const express = require('express');
const app = express()
const cors = require('cors');
const router = require('./src/routes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/v1', router);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
