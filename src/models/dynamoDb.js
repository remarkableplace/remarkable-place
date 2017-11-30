const AWS = require('aws-sdk');

const { IS_OFFLINE } = process.env;

const dynamoDbConfig = {};

if (IS_OFFLINE) {
  dynamoDbConfig.region = 'localhost';
  dynamoDbConfig.endpoint = 'http://localhost:8000';
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDbConfig);

module.exports = dynamoDb;
