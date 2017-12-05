const assert = require('assert');
const _ = require('lodash');
const promisify = require('es6-promisify');
const uuid = require('uuid');
const dynamoDb = require('./dynamoDb');

const dbScan = promisify(dynamoDb.scan, dynamoDb);
const dbGet = promisify(dynamoDb.get, dynamoDb);
const dbQuery = promisify(dynamoDb.query, dynamoDb);
const dbPut = promisify(dynamoDb.put, dynamoDb);
const dbUpdate = promisify(dynamoDb.update, dynamoDb);
const dbDelete = promisify(dynamoDb.delete, dynamoDb);
const { AUTHORS_TABLE } = process.env;

assert.ok(AUTHORS_TABLE, 'Env. variable AUTHORS_TABLE is required');

/**
 * Get authors
 *
 * @function get
 * @returns {Promise<Author[]>} array of authors
 */
function get() {
  return dbScan({
    TableName: AUTHORS_TABLE,
    Limit: 50
  }).then(data => data.Items);
}

/**
 * Get author by id
 *
 * @function getById
 * @param {String} id - author id
 * @returns {Promise<Author>} author
 */
function getById(id) {
  if (!id) {
    return Promise.reject(new Error('id is required'));
  }

  return dbGet({
    TableName: AUTHORS_TABLE,
    Key: { id }
  }).then(data => data.Item);
}

/**
 * Get author by GitHub id
 *
 * @function getByGithubId
 * @param {String} githubId - author's GitHub id
 * @returns {Promise<Author>} author
 */
function getByGithubId(githubId) {
  if (!githubId) {
    return Promise.reject(new Error('githubId is required'));
  }

  return dbQuery({
    TableName: AUTHORS_TABLE,
    IndexName: 'GithubIdIndex',
    KeyConditionExpression: 'githubId = :githubId',
    ExpressionAttributeValues: {
      ':githubId': githubId.toString() // github api returns it as number
    }
  }).then(data => data.Items[0]);
}

/**
 * Create author
 *
 * @function create
 * @param {Object} authorArgs - new author args
 * @param {String} authorArgs.id - id
 * @param {String} authorArgs.githubId - GitHub id
 * @param {String} [authorArgs.githubHandle] - GutHub login (handle)
 * @param {String} [authorArgs.fullName] - fullName
 * @param {String} [authorArgs.avatarUrl] - avatarUrl
 * @param {String} [authorArgs.bio] - bio
 * @returns {Promise<Author>} new author
 */
function create(
  {
    id = uuid.v1(),
    githubId,
    githubHandle = null,
    fullName = null,
    bio = null,
    avatarUrl = null
  } = {}
) {
  if (!githubId) {
    return Promise.reject(new Error('githubId is required'));
  }

  const author = {
    id,
    githubId: githubId.toString(), // github api returns it as number
    githubHandle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fullName,
    bio,
    avatarUrl
  };

  return dbPut({
    TableName: AUTHORS_TABLE,
    Item: author
  }).then(() => author);
}

/**
 * Update author by id
 *
 * @function updateById
 * @param {String} id - author's id
 * @param {Object} authorArgs - new author args
 * @param {String} [authorArgs.fullName] - fullName
 * @param {String} [authorArgs.githubHandle] - GutHub login (handle)
 * @param {String} [authorArgs.avatarUrl] - avatarUrl
 * @param {String} [authorArgs.bio] - bio
 * @returns {Promise<Author>} updated author
 */
function updateById(id, authorArgs = {}) {
  if (!id) {
    return Promise.reject(new Error('id is required'));
  }

  if (authorArgs.id) {
    return Promise.reject(new Error('id cannot be updated'));
  }

  let UpdateExpression = _.map(authorArgs, (value, key) => `${key}= :${key}`);
  UpdateExpression.push('updatedAt= :updatedAt');
  UpdateExpression = `set ${UpdateExpression.join(', ')}`;

  const ExpressionAttributeValues = _.mapKeys(
    authorArgs,
    (value, key) => `:${key}`
  );
  ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();

  return dbUpdate({
    TableName: AUTHORS_TABLE,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeValues: Object.assign(
      { ':updatedAt': new Date().toISOString() },
      ExpressionAttributeValues
    ),
    ReturnValues: 'ALL_NEW'
  }).then(data => data.Attributes);
}

/**
 * Remove author by id
 *
 * @function removeById
 * @param {String} id - author's id
 * @returns {Promise<undefined>} no return value
 */
function removeById(id) {
  if (!id) {
    return Promise.reject(new Error('id is required'));
  }

  return dbDelete({
    TableName: AUTHORS_TABLE,
    Key: {
      id
    }
  });
}

module.exports = {
  get,
  getById,
  getByGithubId,
  create,
  updateById,
  removeById
};
