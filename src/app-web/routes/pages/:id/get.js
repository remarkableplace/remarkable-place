const Markdown = require('../../../../models/markdown');
const Page = require('../../../../models/page');

function get(req, res, next) {
  Page.getById(req.params.id)
    .then(page => {
      const renderedPage = Object.assign({}, page, {
        content: Markdown.render(page.content || '')
      });

      res.render('pages/view', {
        page: renderedPage
      });
      next();
    })
    .catch(next);
}

module.exports = get;
