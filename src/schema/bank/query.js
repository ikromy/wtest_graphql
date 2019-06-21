const { GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const BankType = require('./type')
const BankModel = require('../../models/bank')
const { verifyJwt } = require('../../utils')

module.exports = {
  getBanks: {
    type: GraphQLList(BankType),
    args: {
      code: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      }
    },
    resolve: async (root, args, context) => {
      await verifyJwt(context)
      
      let where = null
      const validArgs = ['code','name']
      
      if (Object.entries(args).length && args.constructor === Object) {
        
        let cols = []
        let vals = []
        
        for ( const val of validArgs ) {
          if (args[val]) {
            cols.push(`${val} = ?`)
            vals.push(args[val])
          }
        }
        
        where = {
          query: cols.join(' OR '),
          binding: vals
        }
      }
      
      return await BankModel.find(where)
    }
  },
  getBankById: {
    type: BankType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      await verifyJwt(context)
      
      const { id } = args
      
      if (id > 0) {
        return await BankModel.get(id)
      }
      else {
        throw new Error("Invalid id")
      }
    }
  },
}
