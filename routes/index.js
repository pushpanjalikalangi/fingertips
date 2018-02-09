var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middleware');
var users = require('./users');
var user = require('./user');
var staff = require('./staff');
var manager = require('./manager');
module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.send('welcome to taGd');
  });
  app.post('/signUp', users.signUp);
  app.post('/logIn', users.logIn);
  app.get('/Roles', users.Roles);
  app.get('/severity', users.severity);
  app.get('/severities', users.severities);
  app.get('/casetype', users.casetype);
  app.get('/cases', users.cases);
  app.get('/caseStatuses', users.caseStatuses);
  app.get('/caseStatus', users.caseStatus);
  app.post('/submitCase', user.submitCase);
  app.get('/staffHome', staff.staffHome);
  app.get('/acceptCases', staff.acceptCases);
  app.post('/caseAccept', staff.caseAccept);
  app.post('/caseResolve', staff.caseResolve);
  app.post('/searchCase', manager.searchCase);
};
