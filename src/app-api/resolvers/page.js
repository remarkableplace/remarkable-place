const boom = require('boom');
const Page = require('../../models/page');
const { authorize } = require('../../models/session');

function getById(id) {
  return Page.getById(id).then(page => {
    if (!page) {
      throw boom.notFound(`Page not found with id ${id}`);
    }
    return page;
  });
}

const resolvers = {
  Query: {
    pages: () => Page.get(),
    page: (root, args) => getById(args.id)
  },
  Mutation: {
    createPage: authorize((root, args) => Page.create(args)),
    updatePage: authorize((root, args) =>
      getById(args.id).then(() => Page.updateById(args.id, args))
    ),
    removePage: authorize((root, args) =>
      getById(args.id).then(page => Page.removeById(args.id).then(() => page))
    )
  }
};

module.exports = resolvers;
