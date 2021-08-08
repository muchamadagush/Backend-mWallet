const usersModel = require("../models/users");
const helper = require("../helpers/helper");

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
      delete result.password;
      helper.responsePagination(
        res,
        200,
        "Showing all users",
        meta,
        totalData,
        totalPage,
        result,
        page,
        perPage
      );
    })
    .catch((err) => {
      helper.responseError(res, 500, err.message);
    });
};


exports.getUsersById = (req, res) => {
  const id = req.params.id;

  usersModel
    .getUsersById(id)
    .then((result) => {
      if (result < 1) {
        helper.responseError(res, 400, `User with id: ${id} is not found`);
        return;
      }
      delete result[0].password;
      helper.responseSuccess(res, 200, "One user found", result);
    })
    .catch((err) => {
      helper.responseError(res, 500, err.message);
    });
};


exports.deleteUsers = (req, res) => {
  const id = req.params.id;

  usersModel
    .deleteUsers(id)
    .then((result) => {
      helper.responseSuccess(res, 200, "Succesfully deleted a user", {});
    })
    .catch((err) => {
      if (err.message === "Internal server error") {
        helper.responseError(res, 500, err.message);
      }
      helper.responseError(res, 400, err.message);
    });
};

exports.updateUsers =  (req, res) => {
  const id = req.params.id
  const { username, email, password, phone, pin, avatar, amount } = req.body
  const data = { 
    id,
    username,
    email,
    password,
    phone,
    pin,
    avatar,
    amount,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  usersModel.updateUsers(id, data)
  .then(() => {
    // console.log(result0
    helper.responseSuccess(res, 200, "Successfully updated user's profile", data);
  })
  .catch((err) => {
    if (err.message === "Internal server error") {
      helper.responseError(res, 500, err.message);
    }
    helper.responseError(res, 400, err.message);
  });
}