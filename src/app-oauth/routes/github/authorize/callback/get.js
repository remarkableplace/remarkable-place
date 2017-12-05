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
            .then(orgResp => ({ githubUser: resp.data, orgs: orgResp.data }))
        );
    })
    // Find or create author
    .then(({ githubUser, orgs }) => {
      if (!GitHub.isOrgMember(orgs)) {
        throw boom.unauthorized(`${githubUser.login} is not part of the org`);
      }

      const githubUserId = githubUser.id.toString();

      return Author.getByGithubId(githubUserId).then(author => {
        if (!author) {
          return Author.create({
            githubId: githubUserId,
            githubHandle: githubUser.login || null,
            fullName: githubUser.name || null,
            avatarUrl: githubUser.avatar_url || null,
            bio: githubUser.bio || null
          });
        }

        return Author.updateById(author.id, {
          githubHandle: githubUser.login || null,
          fullName: githubUser.name || null,
          avatarUrl: githubUser.avatar_url || null,
          bio: githubUser.bio || null
        });
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
