const { GraphQLSchema, GraphQLObjectType } = require('graphql')

const { getUsers, getUserById } = require('./user/query')
const { createUser, updateUser, deleteUser } = require('./user/mutation')

const { getBanks, getBankById } = require('./bank/query')
const { createBank, updateBank, deleteBank } = require('./bank/mutation')

const { getAccounts, getAccountById } = require('./account/query')
const { createAccount, updateAccount, deleteAccount } = require('./account/mutation')

const { getTransfers, getTransferById } = require('./transfer/query')

const RootQueryType = new GraphQLObjectType({
  name: 'Queries',
  fields: () => ({
    getAccounts, getAccountById,
    getBanks, getBankById,
    getTransfers, getTransferById,
    getUsers, getUserById
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser, updateUser, deleteUser,
    createBank, updateBank, deleteBank,
    createAccount, updateAccount, deleteAccount
  })
})

const wlSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

module.exports = wlSchema
