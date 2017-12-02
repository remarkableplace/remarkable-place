const express = require('express');
const errorHandler = require('../utils/errorHandler');

const app = express();

app.get('/admin', (req, res, next) => {
  res.json({
    name: 'remarkable.place - admin'
  });
  next();
});

app.use(errorHandler);

module.exports = app;
