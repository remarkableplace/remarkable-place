const logger = require('pino')();
const boom = require('boom');
const GitHub = require('../../../../../models/github');
const Author = require('../../../../../models/author');

function get(req, res, next) {
  // Handle OAuth Error
  if (req.query.error) {
    next(boom.unauthorized(req.query.error_description));
    return;
  }

  // TODO: move to model
  GitHub.getAccessToken({
    code: req.query.code
  })
    // Get GitHub user
    .then(result => {
      const github = GitHub.create(result.accessToken);
      return github.users
        .get({})
        .then(resp =>
          github.orgs
            .getForUser({ username: resp.data.login })
            .then(orgResp => ({ user: resp.data, orgs: orgResp.data }))
        );
    })
    // Find or create author
    .then(({ user, orgs }) => {
      if (!GitHub.isOrgMember(orgs)) {
        throw boom.unauthorized(`${user.login} is not part of the org`);
      }

      return Author.getByGithubId(user.id).then(author => {
        if (!author) {
          return Author.create({
            githubId: user.id,
            name: user.name
          });
        }

        return author;
      });
    })
    // Update session
    .then(author => {
      req.session.logged = true;
      req.session.authorId = author.id;
    })
    // Respond with redirect or error
    .then(() => {
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
      if (err.isBoom) {
        next(err);
        return;
      }
      logger.error(err);
      next(boom.unauthorized());
    });
}

module.exports = get;
