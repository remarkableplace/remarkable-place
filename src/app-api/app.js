const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');

const app = express();

app.get('/api', (req, res, next) => {
  res.json({
    name: 'remarkable.place - API',
    graphiql: '/api/graphiql'
  });
  next();
});

app.use('/api/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.get('/api/graphiql', graphiqlExpress({ endpointURL: '/api/graphql' }));

module.exports = app;
