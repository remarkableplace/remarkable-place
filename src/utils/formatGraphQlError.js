const logger = require('pino')();
const boom = require('boom');

/**
 * Formt GraphQL Error
 *
 * @param {Error} err
 * @param {boolean} [returnNull=false]
 * @returns {*} error output
 */
function formatGraphQlError(err, returnNull = false) {
  const originalError = err ? err.originalError || err : null;

  // Handle empty errors
  if (!originalError) {
    return returnNull ? null : err;
  }

  // Do not format GraphQL errors
  if (originalError.name === 'GraphQLError') {
    return originalError;
  }

  // Handle known errors
  if (originalError.isBoom) {
    logger.error(err);
    return originalError.output.payload;
  }

  // Do not expose unknown error
  return boom.badImplementation(originalError.message);
}

module.exports = formatGraphQlError;
