const connection = require("../configs/db");

// exports.getAllUsers = (page, perPage, search, sortBy, order) => {
//     return new Promise((resolve, reject) => {
//       connection.query(
//         "SELECT COUNT(*) AS totalData FROM users WHERE username LIKE ? OR phone LIKE ?",
//         [`%${search}%`, `%${search}%`],
//         (err, result) => {
//           let totalData, page, perPage, totalPage;
//           if (err) {
//             reject(new Error("Internal server error"));
//           } else {
//             totalData = result[0].totalData;
//             page = parseInt(page) || 1;
//             perPage = parseInt(perPage) || 2;
//             totalPage = Math.ceil(totalData / perPage);
//           }
//           const firstData = perPage * page - perPage;
//           connection.query(
//             `SELECT * FROM users WHERE username LIKE ? OR phone LIKE ? ORDER BY ${sortBy} ${order} LIMIT ?, ?`,
//             [`%${search}%`, `%${search}%`, firstData, perPage],
//             (err, result) => {
//               if (err) {
//                 reject(new Error("Internal server error"));
//               } else {
//                 resolve([totalData, totalPage, result, page, perPage]);
//               }
//             }
//           );
//         }
//       );
//     });
//   };


  // exports.getUsersById = (id) => {
  //   return new Promise((resolve, reject) => {
  //     connection.query("SELECT * FROM users WHERE id = ?", id, (err, result) => {
  //       if (!err) {
  //         resolve(result);
  //       } else {
  //         reject(new Error("Internal server error"));
  //       }
  //     });
  //   });
  // };

  // exports.deleteUsers = (id) => {
  //   return new Promise((resolve, reject) => {
  //     connection.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
  //       if (!err) {
  //         resolve(result);
  //       } else {
  //         reject(new Error("Internal server error"));
  //       }
  //     });
  //   });
  // };

exports.updateUsers = (id, data) => {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET ? WHERE id = ?', [data, id], (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(error)
          }
        })
      })
    }