const _ = require('lodash');
const moment = require('moment');
const Markdown = require('../../../../models/markdown');
const graphql = require('../../../../graphql');

function get(req, res, next) {
  const query = `
    query {
      author(id: "${req.params.id}") {
        id
        fullName
        avatarUrl
        githubHandle
        bio
        pages {
          id
          title
          content
          createdAt
          author {
            id
            fullName
          }
        }
      }
    }
  `;

  graphql(query)
    .then(({ author }) => {
      const renderedPages = author.pages.map(page =>
        Object.assign({}, page, {
          createdAt: moment(page.createdAt).format('YYYY/MM/DD'),
          content: Markdown.render(page.content || '')
        })
      );

      res.render('authors/view', {
        author: _.omit(author, 'pages'),
        pages: renderedPages
      });
      next();
    })
    .catch(next);
}

module.exports = get;
