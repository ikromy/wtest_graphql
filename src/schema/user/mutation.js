const { GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const UserType = require('./type')
const UserModel = require('../../models/user')
const { signToken, verifyJwt } = require('../../utils')

const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
  createUser: {
    type: UserType,
    args: {
      email: {
        type: GraphQLNonNull(GraphQLString)
      },
      name: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args) => {
      
      const { email, name } = args
      
      const isValidEmail = emailExpression.test(email.toLowerCase())
      if(!isValidEmail) {
        throw new Error("Invalid email")
      }
      
      const [ id ] = await UserModel.post(args)
      const user = await UserModel.get(id)
      const token = signToken(user)
      
      return {...user, token}
    }
  },
  updateUser: {
    type: UserType,
    args: {
      email: {
        type: GraphQLNonNull(GraphQLString)
      },
      name: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context ) => {
      const { id } = await verifyJwt(context)
      const { email, name } = args
      
      const isValidEmail = emailExpression.test(email.toLowerCase())
      if(!isValidEmail) {
        throw new Error("Invalid email")
      }
      
      if (id > 0) {
        await UserModel.put(id, {email,name})
        return await UserModel.get(id)
      }
      else {
        throw new Error("Invalid id")
      }
    }
  },
  deleteUser: {
    type: UserType,
    //args: {
      //id: {
        //type: GraphQLNonNull(GraphQLID)
      //}
    //},
    resolve: async (root, args, context ) => {
      const { id } = await verifyJwt(context)
      
      if (id > 0) {
        const check = await UserModel.get(id)
        if (check) {
           await UserModel.delete(id)
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
