const MarkdownIt = require('markdown-it');
const prism = require('markdown-it-prism');

const md = new MarkdownIt();
md.use(prism);

module.exports = md;
