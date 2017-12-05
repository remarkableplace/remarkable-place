const moment = require('moment');
const Markdown = require('../../../../models/markdown');
const graphql = require('../../../../graphql');

function get(req, res, next) {
  const query = `
    query {
      page(id: "${req.params.id}") {
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
  `;

  graphql(query)
    .then(({ page }) => {
      const renderedPage = Object.assign({}, page, {
        createdAt: moment(page.createdAt).format('YYYY/MM/DD'),
        content: Markdown.render(page.content || ''),
        author: page.author || { fullName: 'anonymus' }
      });

      res.render('pages/view', {
        page: renderedPage
      });
      next();
    })
    .catch(next);
}

module.exports = get;
