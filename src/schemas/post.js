const gql = require('graphql-tag');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('../resolvers/post');

const typeDefs = gql`
  type Post {
    id: ID!
    title: String
  }

  type Query {
    posts: [Post]
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
