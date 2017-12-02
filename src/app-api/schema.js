const _ = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const pageTypeDef = require('./types/page');
const pageResolvers = require('./resolvers/page');

const schema = makeExecutableSchema({
  typeDefs: [pageTypeDef],
  resolvers: _.merge(pageResolvers)
});

module.exports = schema;
