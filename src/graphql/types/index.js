const gql = require('graphql-tag');

const typeDefs = gql`
  type Author {
    id: ID!
    fullName: String
    avatarUrl: String
    bio: String
    githubHandle: String
    pages: [Page]
  }

  type Page {
    id: ID!
    author: Author
    title: String
    content: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    authors: [Author]
    author(id: String!): Author
    pages: [Page]
    page(id: String!): Page
  }

  type Mutation {
    updateAuthor(
      id: String!
      fullName: String
      avatarUrl: String
      bio: String
    ): Author
    removeAuthor(id: String!): Author
    createPage(title: String!, content: String!): Page
    updatePage(id: String!, title: String, content: String): Page
    removePage(id: String!): Page
  }
`;

module.exports = typeDefs;
