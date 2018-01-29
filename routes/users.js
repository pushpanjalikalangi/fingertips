var express = require('express');
var router = express.Router();
var saltRounds = 10;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/tblUser');
var Role = require('../models/tblRole');

exports.roles = (req, res) => {
  var role = new Role({
    RoleId: 3,
    Role: "manager"
  })
  role.save(function(result) {
    res.send("inserted");
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
        console.log(user.RoleId);
        Role.findOne({
          RoleId: user.RoleId
        }).exec((err, role) => {
          if (role) {
            if (bcrypt.compareSync(users.password, hash)) {
              res.status(200).send({
                sucess: true,
                token: "token",
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
    res.status(403).send({
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
        var newUser = new User({
          "UserId": users.UserId,
          "Name": users.Name,
          "password": hash, // use the generateHash function in
          "RoleId": users.RoleId
        });
        newUser.save(function(err) {
          if (err)
            throw err;
          else {
            var newUser = new User({
              "UserId": users.UserId,
              "Name": users.Name,
              "password": hash, // use the generateHash function in
              "RoleId": users.RoleId
            });
            res.status(200).send({
              sucess: true,
              token: "token"
            });
          }
        });
      }
    })
  } else {
    res.status(403).send({
      sucess: false,
      message: 'Invalid details'
    })
  }
}
