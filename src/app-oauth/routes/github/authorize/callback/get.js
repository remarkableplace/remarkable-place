const GitHub = require('../../../../../models/github');

function get(req, res, next) {
  // Handle OAuth Error
  if (req.query.error) {
    res.statusCode = 401;
    res.json({
      error: req.query.error,
      message: req.query.error_description
    });
    return;
  }

  GitHub.getAccessToken({
    code: req.query.code
  })
    .then(result => {
      req.session.logged = true;
      req.session.github = result;

      // Redirect is presented
      if (req.query.redirect_uri) {
        res.redirect(req.query.redirect_uri);
        next();
        return;
      }

      res.statusCode = 204;
      res.send();
      next();
    })
    .catch(err => next(err));
}

module.exports = get;
