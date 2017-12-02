const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.json({
    name: 'remarkable.place'
  });
  next();
});

module.exports = app;
