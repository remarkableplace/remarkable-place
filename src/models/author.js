const assert = require('assert');
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
 * @param {Object} author - new author args
 * @param {String} author.id - id
 * @param {String} author.githubId - GitHub id
 * @param {String} author.name - name
 * @returns {Promise<Author>} new author
 */
function create({ id = uuid.v1(), githubId, name }) {
  const author = {
    id,
    githubId: githubId.toString(), // github api returns it as number
    createdAt: new Date(),
    updated: new Date(),
    name
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
 * @param {Object} author - new author args
 * @param {String} author.name - name
 * @returns {Promise<Author>} updated author
 */
function updateById(id, { name }) {
  return dbUpdate({
    TableName: AUTHORS_TABLE,
    Key: { id },
    UpdateExpression: 'set title = :name, updated: updatedAt',
    ExpressionAttributeValues: {
      ':name': name,
      ':updatedAt': new Date()
    },
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
