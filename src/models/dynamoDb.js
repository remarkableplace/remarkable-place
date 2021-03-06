const AWS = require('aws-sdk');

const { IS_OFFLINE, DYNAMODB_REGION, DYNAMODB_ENDPOINT } = process.env;
const dynamoDbConfig = {};

if (IS_OFFLINE) {
  dynamoDbConfig.region = 'localhost';
  dynamoDbConfig.endpoint = 'http://localhost:8000';
}

if (DYNAMODB_REGION) {
  dynamoDbConfig.region = DYNAMODB_REGION;
}
if (DYNAMODB_ENDPOINT) {
  dynamoDbConfig.endpoint = DYNAMODB_ENDPOINT;
}

const documentClient = new AWS.DynamoDB.DocumentClient(dynamoDbConfig);
const client = new AWS.DynamoDB(dynamoDbConfig);

module.exports = documentClient;
module.exports.client = client;
