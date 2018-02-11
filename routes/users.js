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
var FCM = require('fcm-push');

exports.Roles = (req, res) => {
  var role = new Role({
    roleId: 3,
    _id: 3,
    Role: "Staff"
  })
  role.save(function(result) {
    console.log(result);
    res.send("Role inserted");
  })
}
exports.severities = (req, res) => {
  var severity = new Severity({
    severityTypeId: 4,
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
    severityTypeId: 1,
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
    caseTypeId: 3,
    _id: 3,
    caseType: "Need a Carpenter",
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
    caseTypeId: 1,
    caseType: 1
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
exports.caseStatuses = (req, res) => {
  var casestatus = new Casestatus({
    statusId: 3,
    _id: 3,
    Status: "RESOLVED",
    statusDescription: "when a STAFF closes a case"
  })
  casestatus.save(function(result) {
    res.send("Casestatus inserted");
  });
}
exports.caseStatus = (req, res) => {
  Casestatus.find({}, {
    // _id: 0,
    statusId: 1,
    Status: 1,
    statusDescription: 1
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
          roleId: user.roleId
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
                Role: role.Role,
                Name: user.Name,
                userId: user.userId
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
              message: 'Unable to find the Role'
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
          message: 'Error in Fetching the Details',
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
            var userId = 1;
          } else {
            var id = result.userId;
            var userId = id + 1;
          }
          var newUser = new User({
            "_id": userId,
            "userId": userId,
            "Name": users.Name,
            "password": hash, // use the generateHash function in
            "roleId": users.roleId,
            "mobileNumber": users.mobileNumber,
            "emailId": users.emailId,
            "deviceToken": user.deviceToken
          });
          newUser.save(function(err) {
            if (err) {
              res.status(403).send({
                sucess: false,
                error: err
              });
            } else {
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

// exports.pushNotification = function(req, res) {
//   if (req.body.Name) {
//     User.findOne({
//       Name: req.body.Name
//     }, function(err, result) {
//       if (result) {
//         console.log(result);
//         // var regId = [];
//         // var a = result.user_details.apps
//         // console.log(a);
//         // a.forEach(function(entry) {
//         //   regId.push(entry.reg_id);
//         // })
//         var fcm = new FCM(config.serverKey);
//
//         var message = {
//           registration_ids: [result.deviceToken],
//           // to: regId, // required fill with device token or topics
//           collapse_key: 'your_collapse_key',
//           data: {
//             your_custom_data_key: 'your_custom_data_value'
//           },
//           notification: {
//             title: 'taGd',
//             body: "Hello, " + result.Name
//           }
//         };
//         //callback style
//         fcm.send(message, function(err, response) {
//           if (err) {
//             console.log("Something has gone wrong!");
//             console.log(err);
//             res.send(err)
//           } else {
//             console.log("Successfully sent with response: ", response);
//             res.send(response)
//           }
//         });
//       }
//     })
//   } else {
//     res.status(403)
//       .send({
//         success: false,
//         message: "Invalid details"
//       });
//   }
// }
