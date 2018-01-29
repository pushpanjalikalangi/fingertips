var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middleware');
var users = require('./users');
module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.send('welcome to taGd');
  });
  app.post('/signUp', users.signUp);
  app.post('/logIn', users.logIn);
};
