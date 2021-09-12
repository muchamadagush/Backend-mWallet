const transactionModels = require("../models/transactions");
const contactModels = require("../models/contacts")
const userModels = require("../models/users")
const topupModels = require("../models/topup")
const { v4: uuid } = require("uuid");
const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: 'xnd_development_CYUIcOoXTDgcOET6pMfzbCmCtgRL2VbmxHHllMbIWoxHASivPABvfpwyFVYtVS',
});

const history = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const perPage = req.query.perPage;
    const page = parseInt(req.query.page) || 1;

    const order = req.query.orderBy || "updatedAt";
    const sort = req.query.sortBy || "DESC";

    const limit = parseInt(perPage) || 8;
    const offset = (page - 1) * limit;

    const response = await transactionModels.allHistory(userId)

    const resPagination = await transactionModels.history(userId, limit, offset, order, sort)

    let resData = []
    for (let i = 0; i < resPagination.length; i++) {
      let data = ''
      if (resPagination[i].idUserTransfer === userId) {
        const userTopup = await userModels.getUsersById(resPagination[i].idUserTopup)
        resPagination[i].type = "Transfer"
        resPagination[i].avatar = userTopup[0].avatar
        resPagination[i].username = userTopup[0].username
        data = resPagination[i]
      } else {
        const userTransfer = await userModels.getUsersById(resPagination[i].idUserTransfer)
        resPagination[i].type = "Topup"
        resPagination[i].avatar = userTransfer[0].avatar
        resPagination[i].username = userTransfer[0].username
        data = resPagination[i]
      }
      resData.push(data)
    }

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
        data: resData,
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

const getVAUser = async (req, res, next) => {
  try {
    const { userId } = req.params

    const data = await topupModels.getDataByUserId(userId)

    res.status(200)
     res.json({
       data: data
     });
  } catch (error) {
    next(new Error(error.message))
  }
}

const getAllTransactions = async (req, res, next) => {
  try {
    const perPage = req.query.perPage;
    const page = parseInt(req.query.page) || 1;

    const order = req.query.orderBy || "updatedAt";
    const sort = req.query.sortBy || "DESC";

    const limit = parseInt(perPage) || 8;
    const offset = (page - 1) * limit;

    const response = await transactionModels.dataAllTransactions(order, sort)

    const resPagination = await transactionModels.getAllTransactions(limit, offset, order, sort)

    let data = []
    for (let i = 0; i < resPagination.length; i++) {
      const user = await userModels.getUsersById(resPagination[i].idUserTopup)
      resPagination[i].username = user[0].username

      const fullyear = (resPagination[i].updatedAt).toISOString().slice(0, 10)
      const time = (resPagination[i].updatedAt).toISOString().slice(11, 16)
      resPagination[i].updatedAt = fullyear + ' ' + time
      
      const userTransfer = await userModels.getUsersById(resPagination[i].idUserTransfer)
      resPagination[i].avatar = userTransfer[0].avatar
      resPagination[i].usernameTransfer = userTransfer[0].username

      data.push(resPagination[i])
    }

    let allAmount = []
    for (let i = 0; i < response.length; i++) {
      allAmount.push(response[i].amount)
    }

    let sum = allAmount.reduce((total, next) => {return total + next})

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
          totalAmount: sum
        },
        data: data,
      });
    } else {
      res.status(lastDate);
      res.json({
        message: "No data found",
      });
    }
  } catch (error) {
    next(new Error(error.response));
  }
};

module.exports = {
  history,
  transaction,
  detailTransaction,
  topup,
  createVirtualAccount,
  getVAUser,
  getAllTransactions
};
