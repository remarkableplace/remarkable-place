const moment = require('moment');
const Markdown = require('../../../models/markdown');
const graphql = require('../../../graphql');

const query = `
  query {
    pages {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

function get(req, res, next) {
  graphql(query)
    .then(({ pages }) => {
      const renderedPages = pages.map(page =>
        Object.assign({}, page, {
          createdAt: moment(page.createdAt).format('YYYY/MM/DD'),
          content: Markdown.render(page.content || ''),
          author: page.author || { name: 'anonymus' }
        })
      );

      res.render('pages/list', {
        pages: renderedPages
      });
      next();
    })
    .catch(next);
}

module.exports = get;
