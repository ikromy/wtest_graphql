const { GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const UserType = require('./type')
const UserModel = require('../../models/user')
const { verifyJwt } = require('../../utils')

module.exports = {
  getUsers: {
    type: GraphQLList(UserType),
    args: {
      email: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      }
    },
    resolve: async (root, args, context) => {
      await verifyJwt(context)
      
      let where = null
      const validArgs = ['email','name']
      
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
      
      return await UserModel.find(where)
    }
  },
  getUserById: {
    type: UserType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      await verifyJwt(context)
      
      const { id } = args
      
      if (id > 0) {
        return await UserModel.get(id)
      }
      else {
        throw new Error("Invalid id")
      }
    }
  },
}
