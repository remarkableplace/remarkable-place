const assert = require('assert');
const crypto = require('crypto');
const fp = require('lodash/fp');
const safeCompare = require('safe-compare');
const GitHubAPI = require('github');
const { OAuth2 } = require('oauth');

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_OAUTH_REDIRECT_URI
} = process.env;

assert.ok(GITHUB_CLIENT_ID, 'Env. variable GITHUB_CLIENT_ID is required');
assert.ok(
  GITHUB_CLIENT_SECRET,
  'Env. variable GITHUB_CLIENT_SECRET is required'
);
assert.ok(
  GITHUB_OAUTH_REDIRECT_URI,
  'Env. variable GITHUB_OAUTH_REDIRECT_URI is required'
);

/**
 * Create library
 *
 * @function create
 * @param {String} token
 * @returns {Promise}
 */
function create(token) {
  const github = new GitHubAPI();

  github.authenticate({
    type: 'integration',
    token
  });

  return github;
}

/**
 * @function getOauth2
 * @param {Object} params - { [host], [clientId], [clientSecret], [headers] }
 * @returns {OAuth2} oauth2
 */
function getOAuth2(params = {}) {
  const oauthParams = fp.assign(
    {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      host: 'https://github.com',
      authorizePath: '/login/oauth/authorize',
      accessTokenPath: '/login/oauth/access_token',
      headers: null
    },
    params
  );

  const oauth2 = new OAuth2(
    oauthParams.clientId,
    oauthParams.clientSecret,
    oauthParams.host,
    oauthParams.authorizePath,
    oauthParams.accessTokenPath,
    oauthParams.headers
  );

  return oauth2;
}

/**
 * @function getAuthorizeUrl
 * @param {Object} oauth2Params - { [host], [clientId], [clientSecret], [headers] }
 * @returns {String} authorizeUrl
 */
function getAuthorizeUrl(oauth2Params = {}) {
  return getOAuth2(oauth2Params).getAuthorizeUrl({
    redirect_uri: GITHUB_OAUTH_REDIRECT_URI,
    scope: [],
    state: 'authenticate'
  });
}

/**
 * @function getAccessToken
 * @param {Object} params - { code, [host], [clientId], [clientSecret], [headers] }
 * @param {String} code
 * @returns {String} authorizeUrl
 */
function getAccessToken(params = {}) {
  if (fp.isNil(params.code)) {
    return Promise.reject(new Error('code must be a string'));
  }

  return new Promise((resolve, reject) => {
    getOAuth2(params).getOAuthAccessToken(
      params.code,
      {
        redirect_uri: GITHUB_OAUTH_REDIRECT_URI
      },
      (err, accessToken, refreshToken, results) => {
        if (err) {
          reject(err);
          return;
        }

        if (results.error) {
          reject(results.error_description);
          return;
        }

        // parse response
        const scope = results.scope.split(',');
        const response = fp.flow(
          fp.mapKeys((val, key) => fp.camelCase(key)),
          fp.assign({ accessToken, refreshToken, scope })
        )(results);

        resolve(response);
      }
    );
  });
}

/**
 * @function verifySignature
 * @param {String} signature
 * @param {String} secretToken - different per users
 * @returns {Boolean} isValid
 */
function verifySignature(rawBody, secretToken, signature) {
  const hash = crypto
    .createHmac('sha1', secretToken)
    .update(rawBody)
    .digest('hex');

  return safeCompare(`sha1=${hash}`, signature);
}

module.exports = {
  create,
  getAuthorizeUrl,
  getAccessToken,
  verifySignature
};
