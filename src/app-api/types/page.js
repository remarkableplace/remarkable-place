const gql = require('graphql-tag');

const typeDefs = gql`
  type Page {
    id: ID!
    title: String
  }

  type Query {
    pages: [Page]
  }
`;

module.exports = typeDefs;
