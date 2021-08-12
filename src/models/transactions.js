const conn = require('../configs/db');

const allHistory = (userId) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM transactions WHERE idUserTopup = ? OR idUserTransfer = ?`, [userId, userId,], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const history = (userId, limit, offset, order, sort) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM transactions WHERE idUserTopup = ? OR idUserTransfer = ? ORDER BY ? ? LIMIT ? OFFSET ?`, [userId, userId, order, sort, limit, offset], (error, result) => {
    if (!error) {
      resolve(result);
      console.log(result)
    } else {
      reject(error);
      console.log(error)
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

const dataAllTransactions = (order, sort) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM transactions WHERE status = "success" ORDER BY ${order}  ${sort}`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const getAllTransactions = (limit, offset, order, sort) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM transactions WHERE status = "success" ORDER BY ? ? LIMIT ? OFFSET ?`, [order, sort, limit, offset], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

module.exports = {
  allHistory,
  history,
  transaction,
  detailTransaction,
  getAllTransactions,
  dataAllTransactions
};
