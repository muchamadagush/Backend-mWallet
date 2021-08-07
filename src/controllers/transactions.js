const transactionModels = require("../models/transactions");
const userModels = require("../models/users")
const { v4: uuid } = require("uuid");

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

const transaction = async (req, res, next) => {
  try {
    const { idUserTransfer, idUserTopup, amount, description } = req.body
    const status = "success"

    if (!idUserTransfer) return res.status(400).send({ message: "idUserTransfer cannot be null" })
    if (!idUserTopup) return res.status(400).send({ message: "idUserTransfer cannot be null" })
    if (!amount) return res.status(400).send({ message: "amount cannot be null" })
    if (!description) return res.status(400).send({ message: "description cannot be null" })

    const data = {
      id: uuid().split("-").join(""),
      idUserTransfer,
      idUserTopup,
      amount,
      description,
      status
    }

    const userTransfer = await userModels.getUsersById(idUserTransfer)
    const userTopup = await userModels.getUsersById(idUserTopup)

    const response = await transactionModels.transaction(data)

    let amountUserTransfer = userTransfer.amount
    let amountuserTopup = userTopup.amount

    amountUserTransfer = amountUserTransfer - amount
    amountuserTopup = amountuserTopup + amount

    userTransfer.amount = amountUserTransfer
    userTopup.amount = amountuserTopup

    await userModels.updateUser(idUserTransfer, userTransfer)
    await userModels.updateUser(idUserTopup, userTopup)

    response.info = "Transfer Success"
    data.message = response.info
    data.status = true
    data.balanceLeft = amountUserTransfer
    res.json({
      data
    });
  } catch (error) {
    next(new Error(error.message));
  }
}

module.exports = {
  history,
  transaction
};