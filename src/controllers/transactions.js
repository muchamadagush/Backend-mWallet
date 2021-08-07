const transactionModels = require("../models/products");

const history = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const response = await transactionModels.history(userId)
    if (response) {
      res.status(200);
      res.json({
        data: response,
      });
    } else {
      res.status(404);
      res.json({
        message: "Data not found",
      });
    }
  } catch (error) {
    next(new Error(error.response));
  }
};

module.exports = {
  history
};