const conn = require("../configs/db");

const createContact = (data) =>
  new Promise((resolve, reject) => {
    conn.query(`INSERT INTO contacts SET = ?`, data, (result, error) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });

const findContact = (idUserTopUp, idUserTransfer) =>
  new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM contacts WHERE userId = ${idUserTopUp} AND idUserContact = ${idUserTransfer} OR userId = ${idUserTopUp} AND idUserContact = ${idUserTransfer}`, (result, error) => {
        if (!error) {
          resolve(result)
        } else {
          reject(error)
        }
      }
    );
  });

module.exports = {
  createContact,
  findContact
};
