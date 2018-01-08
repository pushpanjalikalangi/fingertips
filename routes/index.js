var express = require('express');
var router = express.Router();
var users = require('./users');
var polls = require('./polls');
module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.send('welcome to Finger Tips');
  });
  app.post('/signUp', users.signUp);
  app.post('/logIn', users.logIn);
  app.post('/createPoll', polls.createPoll);
  app.put('/submitPoll/:id',polls.submitPoll)
};
