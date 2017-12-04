const boom = require('boom');
const Author = require('../../models/author');
const Page = require('../../models/page');
const { authorize } = require('../../models/session');

/**
 * Get single page by id, throws 404 when not found
 *
 * @param {Object} root - root
 * @param {Object} args - args
 * @returns {Promise<Page>} page
 * @throws {boom.notFound}
 */
function getById(root, args) {
  return Page.getById(args.id).then(page => {
    if (!page) {
      throw boom.notFound(`Page not found with id ${args.id}`);
    }
    return page;
  });
}

/**
 * Create
 *
 * @param {Object} root - root
 * @param {Object} args - args
 * @param {Object} context - context
 * @returns {Promise} promise
 * @throws {boom.unauthorized}
 */
function create(root, args, context) {
  const { authorId } = context.req.session;

  if (!authorId) {
    throw boom.unauthorized('Unknown author');
  }

  return Author.getById(authorId).then(author => {
    const pageArgs = Object.assign({ authorId: author.id }, args);
    return Page.create(pageArgs);
  });
}

const resolvers = {
  Page: {
    author(page) {
      return Author.getById(page.authorId);
    }
  },
  Query: {
    pages: () => Page.get(),
    page: getById
  },
  Mutation: {
    createPage: authorize(create),
    updatePage: authorize((root, args) =>
      getById(args.id).then(() => Page.updateById(args.id, args))
    ),
    removePage: authorize((root, args) =>
      getById(args.id).then(page => Page.removeById(args.id).then(() => page))
    )
  }
};

module.exports = resolvers;
