const GitHub = require('../../../../models/github');

function get(req, res, next) {
  const authorizeUrl = GitHub.getAuthorizeUrl();
  res.redirect(authorizeUrl);
  next();
}

module.exports = get;
