const { GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql')

const AccountType = require('../account/type')
const AccountModel = require('../../models/account')

const BankType = require('../bank/type')
const BankModel = require('../../models/bank')

const TransferType = require('./type')
const TransferModel = require('../../models/transfer')

const UserType = require('../user/type')
const UserModel = require('../../models/user')

const { signToken, verifyJwt } = require('../../utils')

module.exports = {
  createTransfer: {
    type: TransferType,
    args: {
      transfer_from_account: {
        type: GraphQLNonNull(GraphQLString)
      },
      transfer_to_account: {
        type: GraphQLNonNull(GraphQLString)
      },
      amount: {
        type: GraphQLNonNull(GraphQLInt)
      },
      notes: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      token = await verifyJwt(context)
      
      const { transfer_from_account, transfer_to_account, amount, notes } = args
      
      if (transfer_from_account === transfer_to_account) {
        throw new Error("Invalid account")
      }

      if (amount < 10000) {
        throw new Error("Amount transfer at least 10.000")
      }
      
      const dataAccountFrom = await AccountModel.find({query:'account_number = ?',binding:[transfer_from_account]})
      if (!dataAccountFrom.length || (dataAccountFrom.length && dataAccountFrom[0].id_user !== token.id)) {
        throw new Error("Account number origin not found")
      }

      const dataAccountTo = await AccountModel.find({query:'account_number = ?',binding:[transfer_to_account]})
      if (!dataAccountTo.length) {
        throw new Error("Account number destination not found")
      }

      if ((dataAccountFrom.amount - amount) < 50000) {
        throw new Error("Insufficient balance (minumum balance 50.000)")
      }
      //end validation

      const [ id ] = await TransferModel.post({id_account_from:dataAccountFrom[0].id, id_account_to:dataAccountTo[0].id, amount,notes})
      return await TransferModel.get(id)
    }
  },
  updateTransfer: {
    type: TransferType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      },
      notes: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context ) => {
      const token = await verifyJwt(context)
      const { id, notes } = args
      
      if (id > 0) {
        let dataTransfer = await TransferModel.get(id)
        
        if (dataTransfer)  {
          const dataAccount = await AccountModel.get(dataTransfer.id_account_from)
          if (dataAccount && dataAccount.id_user === token.id) {
            await TransferModel.put(id, {notes})
            dataTransfer.notes = notes
            return dataTransfer
          }
          else {
            throw new Error("Invalid account")
          }
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
  deleteTransfer: {
    type: TransferType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context ) => {
      const token = await verifyJwt(context)
      const { id } = args
      
      if (id > 0) {
        let check = await TransferModel.get(id)
        
        if (check)  {
          const dataAccount = await AccountModel.get(check.id_account_from)
          if (dataAccount && dataAccount.id_user === token.id) {
            await TransferModel.delete(id)
            return check
          }
          else {
            throw new Error("Invalid account")
          }
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
