const conn = require('../configs/db');

const history = (userId) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM transactions WHERE idUserTopup = ? OR idUserTransfer = ? AND status = 'success'`, [userId, userId], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const transaction = (data) => new Promise((resolve, reject) => {
  conn.query(`INSERT INTO transactions SET ?`, data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const detailTransaction = (id) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM transactions WHERE id = ?`, id, (error, result) => {
    if (!error) {
      resolve(result)
    } else {
      reject(error)
    }
  })
})

module.exports = {
  history,
  transaction,
  detailTransaction
};
