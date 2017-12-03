const boom = require('boom');
const logger = require('pino')();

/**
 * Error handler middleware
 *
 * @public
 * @param {Error} err - error
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {Next} next - next
 * @returns {undefined} no return value
 */
function errorHandler(err, req, res, next) {
  let finalErr = err;

  if (!err.isBoom) {
    logger.error(err);
    finalErr = boom.badImplementation();
  }

  res.status(finalErr.output.statusCode).json(finalErr.output.payload);
  next();
}

module.exports = errorHandler;
