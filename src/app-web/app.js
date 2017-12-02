const path = require('path');
const express = require('express');
const errorHandler = require('../utils/errorHandler');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', require('./routes/posts/get'));

app.use(errorHandler);

module.exports = app;
