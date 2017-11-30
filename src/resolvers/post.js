const Post = require('../models/post');

const resolvers = {
  Query: {
    posts: () => Post.get()
  }
};

module.exports = resolvers;
