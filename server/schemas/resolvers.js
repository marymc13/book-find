const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }
      throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    addUser: async (parent,  { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { BookData }, context) => {
      if (context.user) {
        const updateSaveBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: BookData } },
          { new: true }
        );

        return updateSaveBook;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updateSaveBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updateSaveBook;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};
module.exports = resolvers;