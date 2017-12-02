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
      res.send(result);
      next();
    })
    .catch(err => next(err));
}

module.exports = get;
