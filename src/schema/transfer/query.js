const { GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const TransferType = require('./type')
const TransferModel = require('../../models/transfer')
const { verifyJwt } = require('../../utils')

module.exports = {
  getTransfers: {
    type: GraphQLList(TransferType),
    args: {
      transfer_to_account: {
        type: GraphQLString
      }
    },
    resolve: async (root, args, context) => {
      const { id } = await verifyJwt(context)
      
      let where = { query: '(FU.id = ? OR TU.id = ?)', binding: [id,id] }
      
      if (args && typeof args.transfer_to_account !== 'undefined' ) {
        if (args.transfer_to_account.length !== 6) {
          throw new Error("Invalid account number")
        }
        
        where = {
          query: '(FU.id = ? OR TU.id = ?) AND ( FA.id = ? OR TA.id)',
          binding: [id,id,args.transfer_to_account,args.transfer_to_account]
        }
      }
      
      return await TransferModel.find(where)
    }
  },
  getTransferById: {
    type: TransferType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      const token = await verifyJwt(context)
      
      const { id } = args
      
      if (id > 0) {
        const where = {
          query: 'transfer.id = ? AND (FU.id = ? OR TU.id = ?)',
          binding: [id, token.id, token.id]
        }
        const data = await TransferModel.find(where)
        return (data.length ? data[0] : null)
      }
      else {
        throw new Error("Invalid id")
      }
    }
  },
}
