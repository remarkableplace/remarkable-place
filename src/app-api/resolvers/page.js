const Page = require('../../models/page');

const resolvers = {
  Query: {
    pages: () => Page.get()
  }
};

module.exports = resolvers;
