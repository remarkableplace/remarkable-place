const boom = require('boom');
const _ = require('lodash');
const Author = require('../../models/author');
const Page = require('../../models/page');
const { authorize } = require('../../models/session');

/**
 * Get single author by id, throws 404 when not found
 *
 * @param {Object} root - root
 * @param {Object} args - args
 * @returns {Promise<Author>} author
 * @throws {boom.notFound}
 */
function getById(root, args) {
  return Author.getById(args.id).then(author => {
    if (!author) {
      throw boom.notFound(`Author not found with id ${args.id}`);
    }
    return author;
  });
}

const resolvers = {
  Author: {
    pages(author) {
      return Page.getByAuthorId(author.id);
    }
  },
  Query: {
    authors: () => Author.get(),
    author: getById
  },
  Mutation: {
    updateAuthor: authorize((root, args) =>
      getById(root, args).then(() =>
        Author.updateById(args.id, _.omit(args, 'id'))
      )
    ),
    removeAuthor: authorize((root, args) =>
      getById(root, args).then(author =>
        Author.removeById(args.id).then(() => author)
      )
    )
  }
};

module.exports = resolvers;
