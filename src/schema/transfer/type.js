const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql')

const AccountType = require('../account/type')
const AccountModel = require('../../models/account')

const TransferType = new GraphQLObjectType({
  name: 'Transfer',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    transfer_from: {
      type: AccountType,
      resolve: async (root, args, context) => {
        return await AccountModel.get(root.id_account_from);
      }
    },
    transfer_to: {
      type: AccountType,
      resolve: async (root, args, context) => {
        return await AccountModel.get(root.id_account_to);
      }
    },
    amount: {
      type: GraphQLNonNull(GraphQLInt)
    },
    notes: {
      type: GraphQLString
    }
  }
})

module.exports = TransferType
