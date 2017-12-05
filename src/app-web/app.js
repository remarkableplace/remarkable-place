const path = require('path');
const express = require('express');
const errorHandler = require('../utils/errorHandler');

const app = express();
const { SITE_TITLE, SITE_SUBTITLE, ANALYTICS_GA } = process.env;

app.locals = {
  site: {
    title: SITE_TITLE || 'remarkable.place',
    subtitle:
      SITE_SUBTITLE ||
      'Blog Engine on AWS Lambda, GraphQL, DynamoDB, and Node.js'
  },
  analytics: {
    ga: ANALYTICS_GA
  }
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', require('./routes/pages/get'));
app.get('/pages/:id', require('./routes/pages/:id/get'));
app.get('/authors/:id', require('./routes/authors/:id/get'));

app.use(errorHandler);

module.exports = app;
