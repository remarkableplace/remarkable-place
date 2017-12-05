const logger = require('pino')();
const boom = require('boom');
const { graphql } = require('graphql');
const schema = require('./schema');

/**
 *
 * @param {String} requestString - GraphQL query
 * @param {String} [rootValue] - rootValue
 * @param {String} [contextValue] - contextValue
 * @param {String} [variableValues] - variableValues
 * @param {String} [operationName] - operationName
 * @returns {Promise} result
 */
function run(
  requestString,
  rootValue,
  contextValue,
  variableValues,
  operationName
) {
  return graphql(
    schema,
    requestString,
    rootValue,
    contextValue,
    variableValues,
    operationName
  ).then(({ errors, data }) => {
    if (errors) {
      logger.error(errors);
      throw boom.serverUnavailable();
    }

    return data;
  });
}

module.exports = run;
