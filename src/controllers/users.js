const usersModel = require("../models/users");
const authModels = require("../models/userAuth")
const helper = require("../helpers/helper");
const { v4: uuid } = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const uploadImageHandler = async (req) => {
  if (req.files === null) {
    throw new Error("No file uploaded.");
  }
  if (req.files.avatar.size > 2 * 1024 * 1024) {
    throw new Error("File size too large!");
  }

  const allowedExtension = [".png", ".jpg", ".jpeg"];
  const { avatar: file } = req.files;
  const extension = path.extname(file.name);

  if (!allowedExtension.includes(extension)) {
    throw new Error(`File type ${extension} are not supported!`);
  }

  const fileName = uuid().split('-').join('') + extension;
  const outputPath = path.join(__dirname, `/../assets/images/${fileName}`);
  await file.mv(outputPath);

  return {
    message: "Successfully uploaded",
    file_name: `${process.env.BASE_URL}/files/${fileName}`,
    file_path: `${fileName}`,
  };
};

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
      helper.responsePagination(
        res,
        200,
        "Showing all users",
        meta = {
          totalData,
          totalPage,
          page,
          perPage
        },
        result,
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

exports.updatePhoneUsers =  (req, res) => {
  const id = req.params.id
  const { phone } = req.body

  const data = {
    phone,
    updatedAt: new Date()
  }

  usersModel.updateUsers(id, data)
  .then((result) => {
    helper.responseSuccess(res, 200, "Successfully updated user's phone", result);
  })
  .catch((err) => {
    if (err.message === "Internal server error") {
      helper.responseError(res, 500, err.message);
    }
    helper.responseError(res, 400, err.message);
  });
}

exports.updateAvatarUsers = async (req, res) => {
  try {
    console.log(req)
    const { id } = req.params

    if (!req.files) return res.status(400).send({ message: "File is required" })
    const avatar = await uploadImageHandler(req)
    
    const data = {
      avatar: avatar.file_name,
      updatedAt: new Date()
    }
  
    await usersModel.updateUsers(id, data)

    helper.responseSuccess(res, 200, "Successfully updated user's avatar");
  } catch (err) {
    if (err.message === "Internal server error") {
      helper.responseError(res, 500, err.message);
    }
    helper.responseError(res, 400, err.message);
  }
}

exports.updatePasswordUsers = async (req, res, next) => {
  try {
    const { email } = req.params
    const { newPassword, password } = req.body

    const user = await authModels.findUser(email);
    const { id } = user[0] 

    bcrypt.compare(password, user[0].password, function (err, resCompare) {
      if (!resCompare) {
        return helper.responseError(res, 401, "password wrong");
      }

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newPassword, salt, function (err, hash) {
          // Store hash in your password DB.
          const data = {
            password: hash
          };
    
          usersModel
            .updateUsers(id, data)
            .then(() => {
              delete data.password;
              jwt.sign(
                { username: user[0].username, email: email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "2h" },
                function (err, token) {
                  common.sendEmail(email, user[0].username, token);
                }
              );
              helper.responseSuccess(res, 200, "Success update password");
            })
            .catch((error) => {
              helper.responseError(res, 500, "error update password");
            });
        });
      });
    });
  } catch (err) {
    if (err.message === "Internal server error") {
      helper.responseError(res, 500, err.message);
    }
    helper.responseError(res, 400, err.message);
  }
}