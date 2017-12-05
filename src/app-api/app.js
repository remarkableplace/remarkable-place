const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('../graphql/schema');
const errorHandler = require('../utils/errorHandler');
const formatGraphQlError = require('../utils/formatGraphQlError');
const session = require('../models/session');

const app = express();

app.use(session.init);

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
