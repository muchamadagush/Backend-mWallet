const helpers = require('../helpers/helper')
const usersModel = require('../models/users')

const isPremiumMember = (req, res, next) => {
  console.log(req.role);
  if (req.role === '1') {
    next()
  } else {
    return helpers.responseError(res, 400, 'Only premium member can transfer some amount of money')
  }
}

module.exports = {
  isPremiumMember
}
