const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql')

const BankType = new GraphQLObjectType({
  name: 'Bank',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    code: {
      type: GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLNonNull(GraphQLString)
    },
  }
})

module.exports = BankType
