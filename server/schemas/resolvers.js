const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');

const resolvers = {
    Query: {
      me: async (parent, args) => {
  
          const user = await User.create(args)
  
          return user;
        }
    },
      Mutation: {
        addUser: async (parent, args) => {
          const user = await User.create(args);

          return { user };
        },
        login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
          return { user };
        },
      }
    
  };
  
  module.exports = resolvers;