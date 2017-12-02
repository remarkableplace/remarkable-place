const express = require('express');
const session = require('../models/session');
const errorHandler = require('../utils/errorHandler');
const authorizeGet = require('./routes/github/authorize/get');
const authorizeCallbackGet = require('./routes/github/authorize/callback/get');

const app = express();

app.use(session.init);

app.get('/oauth', (req, res, next) => {
  res.json({ name: 'remarkable.place - OAuth' });
  next();
});

// GitHub OAuth
app.get('/oauth/github', authorizeGet);
app.get('/oauth/github/callback', authorizeCallbackGet);

app.use(errorHandler);

module.exports = app;
