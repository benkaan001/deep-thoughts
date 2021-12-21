const { User, Thought } = require('../models');

// we set up the resolver that will serve the response for the query

// ---> (-__v -password) is used to omit the Mongoose-specific __v property and users' password
// ---> we are also populating friends and thoughts

const resolvers = {
  Query: {
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
  },
};

module.exports = resolvers;
