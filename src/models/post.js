const promisify = require('es6-promisify');
const dynamoDb = require('./dynamoDb');

const dynamoDbScan = promisify(dynamoDb.scan, dynamoDb);
const TABLE_NAME = 'posts';

/**
 * Get posts
 *
 * @async
 * @function get
 * @returns {Promise<User[]>}
 */
function get() {
  return dynamoDbScan({
    TableName: TABLE_NAME,
    Limit: 50
  }).then(posts => posts.Items);
}

module.exports = {
  get
};
