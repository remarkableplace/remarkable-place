const serverless = require('serverless-http');
const logger = require('pino')();
const app = require('./app');

const PORT = process.env.PORT || 3000;
const { IS_OFFLINE } = process.env;

if (IS_OFFLINE) {
  app.listen(PORT, () => {
    logger.info(`oauth is now running on http://localhost:${PORT}`);
  });
}

module.exports.handler = serverless(app);
