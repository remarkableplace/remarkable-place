const boom = require('boom');
const GitHub = require('../../../../../models/github');

function get(req, res, next) {
  // Handle OAuth Error
  if (req.query.error) {
    next(boom.unauthorized(req.query.error_description));
    return;
  }

  GitHub.getAccessToken({
    code: req.query.code
  })
    .then(result => {
      // TODO: move to model
      const github = GitHub.create(result.accessToken);
      return github.users
        .get({})
        .then(resp =>
          github.orgs
            .getForUser({ username: resp.data.login })
            .then(orgResp => ({ user: resp.data, orgs: orgResp.data }))
        );
    })
    .then(({ user, orgs }) => {
      if (!GitHub.isOrgMember(orgs)) {
        next(boom.unauthorized(`${user.login} is not part of the org`));
        return;
      }

      req.session.logged = true;

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
    .catch(err => {
      next(boom.unauthorized(err.message));
    });
}

module.exports = get;
