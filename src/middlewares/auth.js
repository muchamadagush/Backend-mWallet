const jwt = require("jsonwebtoken");

const verifyAccess = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error("server need token");
    error.code = 401;
    return next(error);
  }
  const result = token.split(" ")[1];
//   console.log(result);
  jwt.verify(result, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const error = new Error("token expired");
        error.status = 401;
        return next(error);
      } else if (err.name === "JsonWebTokenError") {
        const error = new Error("token invalid");
        error.status = 401;
        return next(error);
      } else {
        const error = new Error("token not active");
        error.status = 401;
        return next(error);
      }
    }
    next();
  });
};

module.exports = {
  verifyAccess,
};
