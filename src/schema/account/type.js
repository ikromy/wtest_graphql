const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql')

const BankType = require('../bank/type')
const BankModel = require('../../models/bank')

const UserType = require('../user/type')
const UserModel = require('../../models/user')

const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    account_name: {
      type: UserType,
      resolve: async (root, args, context) => {
        return await UserModel.get(root.id_user);
      }
    },
    account_number: {
      type: GraphQLNonNull(GraphQLString)
    },
    amount: {
      type: GraphQLNonNull(GraphQLInt)
    },
    bank: {
      type: BankType,
      resolve: async (root, args, context) => {
        return await BankModel.get(root.id_bank);
      }
    }
  }
})

module.exports = AccountType
