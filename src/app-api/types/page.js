const gql = require('graphql-tag');

const typeDefs = gql`
  type Page {
    id: ID!
    title: String
    content: String
  }

  type Query {
    pages: [Page]
    page(id: String!): Page
  }

  type Mutation {
    createPage(title: String!, content: String!): Page
    updatePage(id: String!, title: String!, content: String!): Page
    removePage(id: String!): Page
  }
`;

module.exports = typeDefs;
