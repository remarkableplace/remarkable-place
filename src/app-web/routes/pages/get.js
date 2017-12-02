const Markdown = require('../../../models/markdown');
const Page = require('../../../models/page');

function get(req, res, next) {
  Page.get()
    .then(pages => {
      const renderedPages = pages.map(page =>
        Object.assign({}, page, {
          content: Markdown.render(page.content || '')
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
