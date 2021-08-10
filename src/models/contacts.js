const conn = require("../configs/db");

const createContact = (data) => new Promise((resolve, reject) => {
  conn.query(`INSERT INTO contacts SET ?`, data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
})

const findContact = (idUserTopUp, idUserTransfer) =>
  new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM contacts WHERE idUser = '${idUserTopUp}' AND idUserContact = '${idUserTransfer}' OR idUser = '${idUserTransfer}' AND idUserContact = '${idUserTopUp}'`, (result, error) => {
        if (!error) {
          resolve(result)
        } else {
          resolve(error)
        }
      }
    );
  });

module.exports = {
  createContact,
  findContact
};
