const usersModel = require("../models/users");
const helper = require("../helpers/helper");
const { v4: uuidv4 } = require('uuid')
const path = require('path')

exports.getAllUsers = (req, res) => {
  const { page, perPage } = req.query;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order || "ASC";

  usersModel
    .getAllUsers(page, perPage, search, sortBy, order)
    .then(([totalData, totalPage, result, page, perPage]) => {
      if (result < 1) {
        helper.responseError(res, 400, "Users not found");
        return;
      }

      for (let i = 0; i < perPage; i++) {
        if (result[i] === undefined) {
          break;
        } else {
          delete result[i].password;
        }
      }

      helper.responsePagination(
        res,
        200,
        "Showing all users",
        totalData,
        totalPage,
        page,
        perPage,
        result,
      );
    })
    .catch((err) => {
      helper.responseError(res, 500, err.message);
    });
};


// exports.getUsersById = (req, res) => {
//   const id = req.params.id;

//   usersModel
//     .getUsersById(id)
//     .then((result) => {
//       delete result[0].password;
//       if (result < 1) {
//         helper.responseError(res, 400, `User with id: ${id} is not found`);
//         return;
//       }
//       helper.responseSuccess(res, 200, "One user found", result);
//     })
//     .catch((err) => {
//       helper.responseError(res, 500, err.message);
//     });
// };


// exports.deleteUsers = (req, res) => {
//   const id = req.params.id;

//   usersModel
//     .deleteUsers(id)
//     .then((result) => {
//       helper.responseSuccess(res, 200, "Succesfully deleted a user", {});
//     })
//     .catch((err) => {
//       if (err.message === "Internal server error") {
//         helper.responseError(res, 500, err.message);
//       }
//       helper.responseError(res, 400, err.message);
//     });
// };

exports.updateUsers = (req, res) => {
    const id = req.params.id
    const { username, email, password, phone, pin, avatar, amount, role } = req.body
    const data = {
      id: uuidv4(),
      username,
      email,
      password,
      phone,
      pin,
      avatar: `${process.env.API_URL}/file/${req.file.filename}`,
      amount,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    }
   
    usersModel.updateUsers(id, data)
    .then(() => {
      delete data.password;
      helper.responseSuccess(res, 200, "Successfully updated user's profile", data);
    })
    .catch((err) => {
      if (err.message === "Internal server error") {
        helper.responseError(res, 500, err.message);
      }
      helper.responseError(res, 400, err.message);
    });




}

