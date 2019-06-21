const { GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const BankType = require('./type')
const BankModel = require('../../models/bank')
const { verifyJwt } = require('../../utils')

module.exports = {
  createBank: {
    type: BankType,
    args: {
      code: {
        type: GraphQLNonNull(GraphQLString)
      },
      name: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      await verifyJwt(context)
      
      const { code, name } = args
      
      // example handle validation
      if (code.length !== 3) {
        throw new Error("Code must contains 3 characters")
      }
      
      const [ id ] = await BankModel.post(args)
      return await BankModel.get(id)
    }
  },
  updateBank: {
    type: BankType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      },
      code: {
        type: GraphQLNonNull(GraphQLString)
      },
      name: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      await verifyJwt(context)
      
      const { id, code, name } = args
      
      if (code.length !== 3) {
        throw new Error("Code must contains 3 characters")
      }
      
      if (id > 0) {
        await BankModel.put(id, {code,name})
        return await BankModel.get(id)
      }
      else {
        throw new Error("Invalid id")
      }
    }
  },
  deleteBank: {
    type: BankType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context ) => {
      await verifyJwt(context)
      const { id } = args
      
      if (id > 0) {
        const check = await BankModel.get(id)
        if (check) {
           await BankModel.delete(id)
           return check
        }
        else {
          throw new Error("Id not found")
        }
      }
      else {
        throw new Error("Invalid id")
      }
    }
  }
}
