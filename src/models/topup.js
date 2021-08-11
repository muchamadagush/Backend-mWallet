const conn = require('../configs/db');

const createVirtualAccount = (data) => new Promise((resolve, reject) => {
  conn.query(`INSERT INTO topups SET ?`, data, (error, result) => {
    if (!error) {
      resolve(result)
    } else {
      reject(error)
    }
  })
})

const getDataById = (id) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM topups WHERE id = ?`, id, (error, result) => {
    if (!error) {
      resolve(result)
    } else {
      reject(error)
    }
  })
})

const getDataByUserId = (userId) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM topups WHERE userId = ?`, userId, (error, result) => {
    if (!error) {
      resolve(result)
    } else {
      reject(error)
    }
  })
})

module.exports = {
  createVirtualAccount,
  getDataById,
  getDataByUserId
}