const GitHub = require('../../../../models/github');

function get(req, res, next) {
  const authorizeUrl = GitHub.getAuthorizeUrl({}, req.query);
  res.redirect(authorizeUrl);
  next();
}

module.exports = get;
