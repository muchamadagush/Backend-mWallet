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

module.exports = {
  createVirtualAccount
}