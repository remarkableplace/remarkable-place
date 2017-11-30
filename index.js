const serverless = require('serverless-http');
const server = require('./src/server');

const PORT = process.env.PORT || 3000;

if (!module.parent) {
  server.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
  });
}

module.exports.handler = serverless(server.listen);
