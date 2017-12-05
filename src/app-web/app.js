const path = require('path');
const express = require('express');
const errorHandler = require('../utils/errorHandler');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', require('./routes/pages/get'));
app.get('/pages/:id', require('./routes/pages/:id/get'));
app.get('/authors/:id', require('./routes/authors/:id/get'));

app.use(errorHandler);

module.exports = app;
