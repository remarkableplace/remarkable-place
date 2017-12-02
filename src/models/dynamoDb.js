const AWS = require('aws-sdk');

const { IS_OFFLINE } = process.env;

const dynamoDbConfig = {};

if (IS_OFFLINE) {
  dynamoDbConfig.region = 'localhost';
  dynamoDbConfig.endpoint = 'http://localhost:8000';
}

const documentClient = new AWS.DynamoDB.DocumentClient(dynamoDbConfig);
const client = new AWS.DynamoDB(dynamoDbConfig);

module.exports = documentClient;
module.exports.client = client;
