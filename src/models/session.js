const assert = require('assert');
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
const middleware = session({
  store,
  secret: SESSION_SECRET,
  saveUninitialized: false,
  resave: false
});

module.exports = {
  middleware
};
