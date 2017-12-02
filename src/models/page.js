const assert = require('assert');
const uuid = require('uuid');
const promisify = require('es6-promisify');
const dynamoDb = require('./dynamoDb');

const dbScan = promisify(dynamoDb.scan, dynamoDb);
const dbGet = promisify(dynamoDb.get, dynamoDb);
const dbPut = promisify(dynamoDb.put, dynamoDb);
const dbUpdate = promisify(dynamoDb.update, dynamoDb);
const dbDelete = promisify(dynamoDb.delete, dynamoDb);
const { PAGES_TABLE } = process.env;

assert.ok(PAGES_TABLE, 'Env. variable PAGES_TABLE is required');

/**
 * Get pages
 *
 * @async
 * @function get
 * @returns {Promise<Page[]>}
 */
function get() {
  return dbScan({
    TableName: PAGES_TABLE,
    Limit: 50
  }).then(data => data.Items);
}

/**
 * Get page by id
 *
 * @async
 * @function getById
 * @param {String} id - page id
 * @returns {Promise<Page>}
 */
function getById(id) {
  return dbGet({
    TableName: PAGES_TABLE,
    Key: {
      id
    }
  }).then(data => data.Item);
}

/**
 * Create page
 *
 * @async
 * @function create
 * @param {Object} page - new page args
 * @param {String} [page.id] - id, only for testing
 * @param {String} [page.title] - title
 * @param {String} [page.content] - content
 * @returns {Promise<Page>}
 */
function create({ id, title = '', content = '' }) {
  const pageId = id || uuid.v1();
  const page = {
    id: pageId,
    title,
    content
  };

  return dbPut({
    TableName: PAGES_TABLE,
    Item: {
      id,
      title,
      content
    }
  }).then(() => page);
}

/**
 * Create page by id
 *
 * @async
 * @function updateById
 * @param {String} id - page id
 * @param {Object} page - new page args
 * @param {String} page.title - title
 * @param {String} page.content - content
 * @returns {Promise<Page>}
 */
function updateById(id, { title, content }) {
  return dbUpdate({
    TableName: PAGES_TABLE,
    Key: { id },
    UpdateExpression: 'set title = :title, content=:content',
    ExpressionAttributeValues: {
      ':title': title,
      ':content': content
    },
    ReturnValues: 'ALL_NEW'
  }).then(data => data.Attributes);
}

/**
 * Remove page by id
 *
 * @async
 * @function removeById
 * @param {String} id - page id
 * @returns {Promise<undefined>}
 */
function removeById(id) {
  return dbDelete({
    TableName: PAGES_TABLE,
    Key: {
      id
    }
  });
}

module.exports = {
  get,
  getById,
  create,
  updateById,
  removeById
};
