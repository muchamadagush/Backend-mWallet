const userModels = require("../models/userAuth");
const { v4: uuidv4 } = require("uuid");
const helpers = require("../helpers/helpers");
const common = require("../helpers/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const {
    username,
    email,
    password,
    phone,
    role,
  } = req.body;

  const user = await userModels.findUser(email);
  if (user.length > 0) {
    return helpers.response(res, "email sudah ada", null, 401);
  }
  console.log(user);
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.
      const data = {
        id: uuidv4(),
        username: username,
        email: email,
        password: hash,
        phone: phone,
        role: role,
        status: "UNACTIVED",
        createdAt: new Date(),
      };

      userModels
        .insertUser(data)
        .then((result) => {
          delete data.password;
          jwt.sign(
            { username: data.username, email: data.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "2h" },
            function (err, token) {
              common.sendEmail(data.email, data.username, token);
            }
          );
          helpers.response(res, "Success register", data, 200);
        })
        .catch((error) => {
          console.log(error);
          helpers.response(res, "error register", null, 500);
        });
    });
  });
};



module.exports = {
  register,

};
