const { GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql')

const AccountType = require('./type')
const AccountModel = require('../../models/account')

const BankType = require('../bank/type')
const BankModel = require('../../models/bank')

const UserType = require('../user/type')
const UserModel = require('../../models/user')

const { signToken, verifyJwt } = require('../../utils')

module.exports = {
  createAccount: {
    type: AccountType,
    args: {
      account_number: {
        type: GraphQLNonNull(GraphQLString)
      },
      amount: {
        type: GraphQLNonNull(GraphQLInt)
      },
      bank_code: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      token = await verifyJwt(context)
      
      const { account_number, amount, user_email, bank_code } = args
      
      if (bank_code.length !== 3) {
        throw new Error("Code must contains 3 characters")
      }
      
      if (amount < 500000) {
        throw new Error("Amount at least 500.000")
      }
      
      if (account_number.length !== 6) {
        throw new Error("Account number must contains 6 characters")
      }
      //end validation
      
      const dataBank = await BankModel.find({query:'code = ?',binding:[bank_code]})
      if (!dataBank.length) {
        throw new Error("Invalid bank code")
      }
      const [ id ] = await AccountModel.post({id_user:token.id, id_bank:dataBank[0].id, account_number,amount})
      return newAccount = await AccountModel.get(id)
    }
  },
  updateAccount: {
    type: AccountType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      },
      amount_topup: {
        type: GraphQLNonNull(GraphQLInt)
      }
    },
    resolve: async (root, args, context ) => {
      const token = await verifyJwt(context)
      const { id, amount_topup } = args
      
      if (amount_topup < 50000) {
        throw new Error("Amount topup at least 50.000")
      }
      
      if (id > 0) {
        let dataAccount = await AccountModel.get(id)
        
        if (dataAccount && dataAccount.id_user === token.id)  {
          await AccountModel.put(id, {amount: (dataAccount.amount+amount_topup)})
          dataAccount.amount = dataAccount.amount+amount_topup
          return dataAccount
        }
        else {
          throw new Error("Invalid account")
        }
      }
      else {
        throw new Error("Invalid id")
      }
    }
  },
  deleteAccount: {
    type: AccountType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context ) => {
      const token = await verifyJwt(context)
      const { id } = args
      
      if (id > 0) {
        let check = await AccountModel.get(id)
        
        if (check && check.id_user === token.id)  {
          await AccountModel.delete(id)
          return check
        }
        else {
          throw new Error("Invalid account")
        }
      }
      else {
        throw new Error("Invalid id")
      }
    }
  }
}
