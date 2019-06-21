const { GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const AccountType = require('./type')
const AccountModel = require('../../models/account')
const { verifyJwt } = require('../../utils')

module.exports = {
  getAccounts: {
    type: GraphQLList(AccountType),
    args: {
      account_number: {
        type: GraphQLString
      },
      account_name: {
        type: GraphQLString
      },
      bank_name: {
        type: GraphQLString
      }
    },
    resolve: async (root, args, context) => {
      const { id } = await verifyJwt(context)
      
      let where = { query: 'user.id = ?', binding: [id] }
      
      const validArgs = {
        account_number: 'account.account_number',
        account_name: 'user.name',
        bank_name: 'bank.name'
      }
      
      if (Object.entries(args).length && args.constructor === Object) {
        
        let cols = []
        let vals = []
        
        for ( const key in validArgs ) {
          if (args[key]) {
            cols.push(`${validArgs[key]} = ?`)
            vals.push(args[key])
          }
        }
        
        where = {
          query: 'user.id = ? AND (' + cols.join(' OR ') + ')',
          binding: [id, ...vals]
        }
      }
      
      return await AccountModel.find(where)
    }
  },
  getAccountById: {
    type: AccountType,
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
          query: 'account.id = ? AND user.id = ?',
          binding: [id, token.id]
        }
        const data = await AccountModel.find(where)
        return (data.length ? data[0] : null)
      }
      else {
        throw new Error("Invalid id")
      }
    }
  },
}
