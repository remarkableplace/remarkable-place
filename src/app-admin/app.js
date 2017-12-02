const express = require('express');

const app = express();

app.get('/admin', (req, res, next) => {
  res.json({
    name: 'remarkable.place - admin'
  });
  next();
});

// GitHub Auth
app.get('/admin/github/authorize', require('./routes/github/authorize/get'));
app.get(
  '/admin/github/authorize/callback',
  require('./routes/github/authorize/callback/get')
);

module.exports = app;
