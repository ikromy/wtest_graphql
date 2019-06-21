const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    email: {
      type: GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLNonNull(GraphQLString)
    },
    token: {
      type: GraphQLNonNull(GraphQLString)
    },
  }
})

module.exports = UserType
