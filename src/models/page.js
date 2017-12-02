const assert = require('assert');
const promisify = require('es6-promisify');
const dynamoDb = require('./dynamoDb');

const dynamoDbScan = promisify(dynamoDb.scan, dynamoDb);
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
  return dynamoDbScan({
    TableName: PAGES_TABLE,
    Limit: 50
  }).then(pages => pages.Items);
}

module.exports = {
  get
};
