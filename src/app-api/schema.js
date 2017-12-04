const _ = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./types');
const authorResolvers = require('./resolvers/author');
const pageResolvers = require('./resolvers/page');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: _.merge(authorResolvers, pageResolvers)
});

module.exports = schema;
