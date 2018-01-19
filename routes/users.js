var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var jwt = require('jsonwebtoken');
var config = require('../config');

exports.signUp = (req, res) => {
  try {
    if (req.body) {
      var hash = bcrypt.hashSync(req.body.password, saltRounds);
      var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        flatNumber: req.body.flatNumber,
        password: hash,
        MobileNumber: req.body.MobileNumber
      });
      user.save((err, user) => {
        try {
          if (err) {
            res.status(403).send({
              sucess: false,
              error: err
            })
          } else {
            res.status(200)
              .send({
                sucess: true,
                message: 'User is Registered Succefully',
                user: user
              })
          }
        } catch (e) {
          res.status(403).send({
            sucess: false,
            error: e,
            message: 'Error in creating the User Registration'
          })
        }
      })
    } else {
      res.status(403).send({
        sucess: false,
        message: 'Invalid details'
      })
    }
  } catch (e) {
    console.log("createUser Error ", e);
    res.status(500).send({
      sucess: false,
      message: 'Internal Server Error',
      response: res
    });
  }
}
exports.logIn = (req, res) => {
  try {
    if (req.body) {
      console.log(req.body);
      res.setHeader("Access-Control-Allow-Origin", "contentType");
       User.findOne({
        $or: [{
            'MobileNumber': req.body.MobileNumber
          },
          {
            'flatNumber': req.body.flatNumber
          }
        ]
      }).exec((err, result) => {
        console.log(err);
        console.log(result);
        if (err) {
          res.status(403).send({
            sucess: false,
            error: err,
            message: 'Error in fetching the user details'
          });
        } else if(result){
          var hash = bcrypt.hashSync(req.body.password, saltRounds);
          if (bcrypt.compareSync(req.body.password, hash)) {
            res.status(200).send({
              sucess: true
            })
          } else {
            res.status(403).send({
              sucess: false,
              message: 'Incorrect password'
            });
          }
        }else {
          res.status(403).send({
            sucess: false,
            message: 'Incorrect MobileNumber/flatNumber'
          });
        }
      })
    } else {
      res.status(403).send({
        sucess: false,
        message: 'Invalid details'
      });
    }
  } catch (e) {
    console.log("VerifyingUser Error ", e);
    res.status(500).send({
      sucess: false,
      message: 'Internal Server Error',
      response: res
    });
  }
}
