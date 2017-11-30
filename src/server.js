const restify = require('restify');
const { graphqlRestify, graphiqlRestify } = require('apollo-server-restify');
const schema = require('./schemas/post');

const server = restify.createServer({
  title: 'remarkable.place server'
});

const graphQLOptions = { schema };

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.get('/', (req, res, next) => {
  res.json({
    name: 'remarkable.place',
    graphiql: '/graphiql'
  });
  next();
});

server.post('/graphql', graphqlRestify(graphQLOptions));
server.get('/graphql', graphqlRestify(graphQLOptions));

server.get('/graphiql', graphiqlRestify({ endpointURL: '/graphql' }));

module.exports = server;
