const MarkdownIt = require('markdown-it');
const Page = require('../../../models/page');

const md = new MarkdownIt();

function get(req, res, next) {
  Page.get()
    .then(pages => {
      const renderedPages = pages.map(page =>
        Object.assign({}, page, {
          content: md.render(page.content || '')
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
