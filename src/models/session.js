const assert = require('assert');
const boom = require('boom');
const session = require('express-session');
const createDynamoDbStore = require('connect-dynamodb');
const { client } = require('./dynamoDb');

const { SESSIONS_TABLE, SESSION_SECRET } = process.env;
assert.ok(SESSIONS_TABLE, 'Env. variable SESSIONS_TABLE is required');
assert.ok(SESSION_SECRET, 'Env. variable SESSION_SECRET is required');

const DynamoDBStore = createDynamoDbStore({ session });
const store = new DynamoDBStore({
  table: SESSIONS_TABLE,
  client
});

/**
 * Init session middleware
 *
 * @function init
 * @public
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {Next} next - next
 * @returns {undefined} no return value
 */
const init = session({
  store,
  secret: SESSION_SECRET,
  saveUninitialized: false,
  resave: false
});

/**
 * Authorize middleware
 *
 * @public
 * @param {Request} resolver - resolver
 * @returns {undefined} no return value
 */
function authorizeFactory(resolver) {
  return function authorize(root, args, context, info) {
    if (!context || !context.session || !context.session.logged) {
      return Promise.reject(boom.unauthorized());
    }

    return resolver(root, args, context, info);
  };
}

module.exports = {
  init,
  authorize: authorizeFactory
};
