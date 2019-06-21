const userModel = require('./models/user'); 
const bankModel = require('./models/bank'); 
const accountModel = require('./models/account'); 
const {
  GraphQLSchema,
  GraphQLObjectType,
  // GraphQLEnumType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList
} = require('graphql')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    email: {
      type: GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLNonNull(GraphQLString)
    },
  }
})

const BankType = new GraphQLObjectType({
  name: 'Bank',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    code: {
      type: GraphQLNonNull(GraphQLInt)
    },
    name: {
      type: GraphQLNonNull(GraphQLString)
    },
  }
})

const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: {
      type: GraphQLInt
    },
    user: {
      type: UserType,
      resolve: async (root, args, context) => {
        return await userModel.get(root.user_id);
      }
    },
    account_number: {
      type: GraphQLString
    },
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    Users: {
      type: GraphQLList(UserType),
      args: {
        email: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        }
      },
      resolve: async (root, args) => {
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
        
        return await userModel.find(where);
      }
    },
    User: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: async (root, args, context) => {
        return await userModel.get(args.id);
      }
    },
    Banks: {
      type: GraphQLList(UserType),
      args: {
        code: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        }
      },
      resolve: async (root, args) => {
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
        
        return await bankModel.find();
      }
    },
    Bank: {
      type: BankType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: async (root, args, context) => {
        return await bankModel.get(args.id);
      }
    },
    Accounts: {
      type: GraphQLList(AccountType),
      resolve: async (_, args, context) => {
        console.log('CONTEXT', { context });
        return await accountModel.find();
      }
    },
    Account: {
      type: AccountType,
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: async (parent, args, context) => {
        return await accountModel.get(args.id);
      }
    }
  }
})

/* 
 * contoh akses mutasi
 * mutation newUser{
 *   newUser(username: "endi", password: "xxx@yyy.zzz", email: "123456") {
 *    username
 *     email
 *   }
 * }
 * 
 * mutation newUser($username: String, $password: String, $email: String){
 *   newUser(username: $username, password: $password, email: $email) {
 *     username
 *     email
 *   }
 * }
 * 
 * */

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    User: {
      type: UserType,
      args: {
        id: {
          type: GraphQLInt
        },
        email: {
          type: GraphQLNonNull(GraphQLString)
        },
        name: {
          type: GraphQLNonNull(GraphQLString)
        }
      },
      resolve: async (root, args) => {
        let { id, email, name } = args;
        if (id) {
          await userModel.put(id, {email,name});
        }
        else {
          [ id ] = await userModel.post(args);
        }
        
        return await userModel.get(id);
      }
    },
    Bank: {
      type: BankType,
      args: {
        id: {
          type: GraphQLInt
        },
        code: {
          type: GraphQLNonNull(GraphQLString)
        },
        name: {
          type: GraphQLNonNull(GraphQLString)
        }
      },
      resolve: async (root, args) => {
        let { id, code, name } = args;
        if (id) {
          await bankModel.put(id, {code,name});
        }
        else {
          [ id ] = await bankModel.post(args);
        }
        
        return await bankModel.get(id);
      }
    },
    opsUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLInt
        },
        username: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        },
        type: {
          type: GraphQLString
        }
      },
      resolve: async (value, body, context) => {

        let { id, username, email, password, type } = body;
        
        if(type === 'new') {
          const data = { username, email, password };
          let [ idUser ] = await userModel.post(data);
          let user = await userModel.get(idUser);
          console.log('USER', { user });
          return user;
        }
        if(type === 'edit') {
          // edit data
        }
        if(type === 'delete') {
          // edit data
        }

        return data;
      }
    }
  }),
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})
