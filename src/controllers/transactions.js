const transactionModels = require("../models/transactions");
const contactModels = require("../models/contacts")
const userModels = require("../models/users")
const topupModels = require("../models/topup")
const { v4: uuid } = require("uuid");
const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: 'xnd_development_GomfrGhMBtwHIglXqNyFgmzzlc2X0eZkFuePKNegd1OkAbRiK7PbW56B384vNU2',
});

const history = async (req, res, next) => {
  try {

    const { userId } = req.params;

    const { perPage } = req.query;
    const page = req.query.page || 1;

    const order = req.query.orderBy || "updatedAt";
    const sort = req.query.sortBy || "DESC";
    const search = req.query.search || "";

    const limit = perPage || 8;
    const offset = (page - 1) * limit;

    const response = await transactionModels.history(userId, search)

    const resPagination = await transactionModels.history(userId, search, limit, offset, order, sort, search)

    const allData = response.length
    const totalPage = Math.ceil(allData / limit);
    if (resPagination) {
      res.status(200);
      res.json({
        meta: {
          allData,
          page,
          perPage: limit,
          totalPage,
        },
        data: response,
      });
    } else {
      res.status(404);
      res.json({
        message: "Data not found",
      });
    }
  } catch (error) {
    console.log(error.response)
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
      amount: parseInt(amount),
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const userTransfer = await userModels.getUsersById(idUserTransfer)
    const userTopup = await userModels.getUsersById(idUserTopup)

    const response = await transactionModels.transaction(data)

    let amountUserTransfer = userTransfer[0].amount
    let amountuserTopup = userTopup[0].amount

    amountUserTransfer = amountUserTransfer - parseInt(amount)
    amountuserTopup = amountuserTopup + parseInt(amount)

    if (amountUserTransfer < 0) return res.status(400).send({ message: 'your remaining balance is insufficient, please refill it first' });

    const upadateUserTransfer = {
      amount: amountUserTransfer,
      updatedAt: new Date()
    }

    const upadateUserTopup = {
      amount: amountuserTopup,
      updatedAt: new Date()
    }

    await userModels.updateUsers(idUserTransfer, upadateUserTransfer)
    await userModels.updateUsers(idUserTopup, upadateUserTopup)

    const findContacts = await contactModels.findContact(idUserTopup, idUserTransfer)

    if (findContacts.length === 0) {
      const dataContact = {
        id: uuid().split("-").join(""),
        idUser: idUserTopup,
        idUserContact: idUserTransfer,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await contactModels.createContact(dataContact)
    }

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

const detailTransaction = async (req, res, next) => {
  try {
    const { id } = req.params

    const response = await transactionModels.detailTransaction(id)

    if (response.length) {
      res.status(200)
      res.json({
        data: response
      });

    } else {
      res.status(404).send({ message: "Data not found" });
    }
  } catch (error) {
    next(new Error(error.message))
  }
}

const createVirtualAccount = async (req, res, next) => {
  try {
    const { userId } = req.body
    const { codeBank } = req.body

    const user = await userModels.getUsersById(userId)

    const { VirtualAcc } = x;
    const vaSpecificOptions = {};
    const va = new VirtualAcc(vaSpecificOptions);

    const resp = await va.createFixedVA({
      externalID: `matrix-${userId}`,
      bankCode: codeBank,
      name: user[0].username,
    });

    const data = {
      id: resp.id,
      userId: userId,
      virtualAccount: resp.account_number,
      simulation: resp.external_id
    }

    await topupModels.createVirtualAccount(data)

    res.status(201).send({ message: "Successfully created virtual account" })
  } catch (error) {
    next(new Error(error.message))
  }
}

const topup = async (req, res, next) => {
  try {
    const { callback_virtual_account_id, amount, bank_code, payment_id } = req.body

    // get data from topup table where id = callback_virtual_account_id
    const data = await topupModels.getDataById(callback_virtual_account_id)

    // get user where id = userid from table topup
    const userId = data[0].userId
    const user = await userModels.getUsersById(userId)

    // set transactions
    const dataTopup = {
      id: uuid().split("-").join(""),
      idUserTopup: userId,
      bankName: bank_code,
      amount: parseInt(amount),
      description: payment_id,
      status: "success",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await transactionModels.transaction(dataTopup)

    // update amount user + amount topup
    const amountUser = user[0].amount + amount
    const dataUpdate = {
      amount: amountUser,
      updatedAt: new Date()
    }

    await userModels.updateUsers(userId, dataUpdate)

    res.status(200)
    res.json({
      message: "Topup success",
      data: req.body
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

module.exports = {
  history,
  transaction,
  detailTransaction,
  topup,
  createVirtualAccount
};
