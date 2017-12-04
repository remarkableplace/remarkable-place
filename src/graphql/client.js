const logger = require('pino')();
const boom = require('boom');
const { graphql } = require('graphql');
const schema = require('./schema');

/**
 *
 * @param {String} query - GraphQL query
 * @returns {Promise} result
 */
function run(query) {
  return graphql(schema, query).then(({ errors, data }) => {
    if (errors) {
      logger.error(errors);
      throw boom.serverUnavailable();
    }

    return data;
  });
}

module.exports = run;
