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
    password
  } = req.body;

  const user = await userModels.findUser(email);
  if (user.length > 0) {
    return helpers.response(res, "email already exists", null, 401);
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.
      const data = {
        id: uuidv4().split('-').join(''),
        username: username,
        email: email,
        password: hash,
        role: "MEMBER",
        amount: 0,
        status: "UNACTIVED",
        createdAt: new Date(),
        updatedAt: new Date()
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
              common.sendEmailActivation(data.email, data.username, token);
            }
          );
          
        })
        .catch((error) => {
          helpers.response(res, "error register", null, 500);
        });
    });
  });
};

const activation = (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    const error = new Error("server need token");
    error.code = 401;
    return next(error);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      helpers.response(res, "Activation failed", null, 401);
    }
    const email = decoded.email;
    userModels
      .activationUser(email)
      .then(() => {

        //  helpers.response(res, "Success activation", email, 200);
        res.redirect(`${process.env.FRONT_URL}/login`);

      })
      .catch((error) => {
        helpers.response(res, "failed change status", null, 401);
      });
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await userModels.findUser(email);
  const user = result[0];
  const status = user.status;
 
  if (status == "ACTIVED") {
    bcrypt.compare(password, user.password, function (err, resCompare) {
      if (!resCompare) {
        return helpers.response(res, "password wrong", null, 401);
      }

      // generate token
      jwt.sign(
        {
          username: user.username,
          email: user.email,
          pin: user.pin,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" },
        function (err, token) {
          delete user.password;
          user.token = token;
          helpers.response(res, "success login", user, 200);
        }
      );
    });
  } else {
    return helpers.response(res, "account not actived", null, 401);
  }
};

const setPin = async (req, res, next) => {
  try {
    const { id } = req.params
    const { pin } = req.body

    userModels.setPinUser(id, pin)

    helpers.response(res, "Success set pin", id, 200);

  } catch (error) {
    helpers.response(res, "failed set pin", null, 401);
  }
};

const forgotPassword =  (req, res, next) => {
  const  {email} = req.body;
   userModels
     .findUser(email)
     .then((result) => {
         const user = result[0];
           delete user.password;
         jwt.sign(
           { username: user.username, email: user.email },
           process.env.ACCESS_TOKEN_SECRET,
           { expiresIn: "2h" },
           function (err, token) {
             common.sendEmailResetPassword(user.email, user.username, token); 
               helpers.response(res, "Success forgot password", user, 200);
           }
         )
      
     })
     .catch((error) => {
       helpers.response(res, "failed forgot password", null, 401);
     });
}

const resetPassword = (req, res, next) => {
  const token = req.params.token;
  const {newPassword} = req.body
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newPassword, salt, function (err, hash) {
      if (!token) {
        const error = new Error("server need token");
        error.code = 401;
        return next(error);
      }
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            helpers.response(res, "Access denied", null, 401);
          }
          const email = decoded.email;
          userModels
            .resetPassword(email, hash)
            .then(() => {
              helpers.response(res, "Success set new password", email, 200);
              res.redirect(`${process.env.FRONT_URL}/login/`);
            })

            .catch((error) => {
              helpers.response(res, "failed set new password", null, 401);
            });
        }
      );
    });
  })

};
module.exports = {
  register,
  activation,
  login,
  setPin,
  forgotPassword,
  resetPassword,
};
