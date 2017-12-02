const express = require('express');
const session = require('../models/session');
const authorizeGet = require('./routes/github/authorize/get');
const authorizeCallbackGet = require('./routes/github/authorize/callback/get');

const app = express();

app.use(session.middleware);

app.get('/oauth', (req, res, next) => {
  res.json({ name: 'remarkable.place - OAuth' });
  next();
});

// GitHub OAuth
app.get('/oauth/github', authorizeGet);
app.get('/oauth/github/callback', authorizeCallbackGet);

module.exports = app;
