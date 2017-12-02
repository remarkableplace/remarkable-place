const express = require('express');

const app = express();

app.get('/admin', (req, res, next) => {
  res.json({
    name: 'remarkable.place - admin'
  });
  next();
});

module.exports = app;
