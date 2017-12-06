const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('../graphql/schema');
const errorHandler = require('../utils/errorHandler');
const formatGraphQlError = require('../utils/formatGraphQlError');
const session = require('../models/session');

const app = express();
const { IS_OFFLINE } = process.env;

app.use(session.init);

// Local development
if (IS_OFFLINE) {
  app.use(cors({ origin: true, credentials: true }));
}

app.get('/api', (req, res, next) => {
  res.json({
    name: 'remarkable.place - API',
    graphiql: '/api/graphiql'
  });
  next();
});

app.use(
  '/api/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: { session: req.session },
    formatError: formatGraphQlError
  }))
);
app.get('/api/graphiql', graphiqlExpress({ endpointURL: '/api/graphql' }));

app.use(errorHandler);

module.exports = app;
