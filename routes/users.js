var express = require('express');
var router = express.Router();
var saltRounds = 10;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/tblUser');
var Role = require('../models/tblRole');
var Severity = require('../models/tblSeverityTypes');
var Casetype = require('../models/tblCaseTypes');
var Casestatus = require('../models/tblCaseStatus');
var Casetransaction = require('../models/tblCaseTransaction');
var config = require('../config');

exports.roles = (req, res) => {
  var role = new Role({
    RoleId: 3,
    _id: 3,
    Role: "manager"
  })
  role.save(function(result) {
    res.send("Role inserted");
  })
}
exports.severitys = (req, res) => {
  var severity = new Severity({
    SeverityTypeId: 4,
    _id: 4,
    Severity: "Severity4",
    SLA: 360
  })
  severity.save(function(result) {
    res.send("Severity inserted");
  });
}
exports.severity = (req, res) => {
  Severity.find({}, {
    // _id: 0,
    SeverityTypeId: 1,
    Severity: 1,
    SLA: 1
  }).exec((err, severitys) => {
    if (err) {
      res.status(403).send({
        sucess: false,
        Error: err
      })
    } else {
      res.status(200).send({
        sucess: true,
        severitys
      })
    }
  })
}
exports.cases = (req, res) => {
  var casetype = new Casetype({
    CaseTypeId: 3,
    _id: 3,
    CaseType: "Need a Carpenter",
  })
  casetype.save(function(err, result) {
    console.log(err);
    console.log(result);
    res.send("Casetype inserted");
  });
}
exports.casetype = (req, res) => {
  Casetype.find({}, {
    // _id: 0,
    CaseTypeId: 1,
    CaseType: 1
  }).exec((err, casetypes) => {
    if (err) {
      res.status(403).send({
        sucess: false,
        Error: err
      })
    } else {
      res.status(200).send({
        sucess: true,
        casetypes: casetypes
      })
    }
  })
}
exports.casestatuses = (req, res) => {
  var casestatus = new Casestatus({
    StatusId: 3,
    _id: 3,
    Status: "RESOLVED",
    StatusDescription: "when a STAFF closes a case"
  })
  casestatus.save(function(result) {
    res.send("Casestatus inserted");
  });
}
exports.casestatus = (req, res) => {
  Casestatus.find({}, {
    // _id: 0,
    StatusId: 1,
    Status: 1,
    StatusDescription: 1
  }).exec((err, casestatuses) => {
    if (err) {
      res.status(403).send({
        sucess: false,
        Error: err
      })
    } else {
      res.status(200).send({
        sucess: true,
        casestatuses: casestatuses
      })
    }
  })
}
exports.logIn = (req, res) => {
  if (req.body) {
    var users = req.body
    res.setHeader("Access-Control-Allow-Origin", "contentType");
    User.findOne({
      Name: users.Name
    }).exec((err, user) => {
      if (err) {
        res.status(403).send({
          sucess: false,
          message: 'Error in fetching the details',
          Error: err
        });
      } else if (!user) {
        res.status(403).send({
          sucess: false,
          message: 'User is not Registered'
        });
      } else {
        var hash = user.password;
        Role.findOne({
          RoleId: user.RoleId
        }).exec((err, role) => {
          if (role) {
            if (bcrypt.compareSync(users.password, hash)) {
              global.jwtToken = jwt.sign({
                'password': users.password
              }, config.jwtsecret, {
                expiresIn: "365d" // expires in 365d
              });
              res.status(200).send({
                sucess: true,
                token: jwtToken,
                Role: role.Role
              })
            } else {
              res.status(403).send({
                sucess: false,
                message: 'Incorrect Name or password'
              });
            }
          } else {
            res.status(403).send({
              sucess: false,
              message: 'Unable to find the role'
            });
          }
        })
      }
    })
  } else {
    res.status(400).send({
      sucess: false,
      message: 'Invalid details'
    });
  }
}
exports.signUp = (req, res) => {
  if (req.body) {
    var users = req.body
    User.findOne({
      Name: users.Name
    }).exec((err, user) => {
      if (err) {
        res.status(403).send({
          sucess: false,
          message: 'Error in fetching the details',
          Error: err
        });
      } else if (user) {
        res.status(403).send({
          sucess: false,
          message: 'User is Already Registered',
        });
      } else {
        var hash = bcrypt.hashSync(users.password, saltRounds);
        User.findOne().sort({
          _id: -1
        }).limit(1).exec((err, result) => {
          if (result == null) {
            var UserId = 1;
          } else {
            var id = result.UserId;
            var UserId = id + 1;
          }
          var newUser = new User({
            "_id": UserId,
            "UserId": UserId,
            "Name": users.Name,
            "password": hash, // use the generateHash function in
            "RoleId": users.RoleId,
            "MobileNumber": users.MobileNumber,
            "EmailId": users.EmailId
          });
          newUser.save(function(err) {
            if (err)
              throw err;
            else {
              global.jwtToken = jwt.sign({
                'password': users.password
              }, config.jwtsecret, {
                expiresIn: "365d" // expires in 365d
              });
              res.status(200).send({
                sucess: true,
                token: jwtToken
              });
            }
          });
        });
      }
    })
  } else {
    res.status(400).send({
      sucess: false,
      message: 'Invalid details'
    })
  }
}
