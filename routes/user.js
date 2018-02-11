var express = require('express');
var router = express.Router();
var User = require('../models/tblUser');
var Severity = require('../models/tblSeverityTypes');
var Casetype = require('../models/tblCaseTypes');
var Casestatus = require('../models/tblCaseStatus');
var Casetransaction = require('../models/tblCaseTransaction');
var config = require('../config');
var FCM = require('fcm-push');

exports.submitCase = (req, res) => {
  if (req.body) {
    var cases = req.body;
    Casetransaction.findOne().sort({
      _id: -1
    }).limit(1).exec((err, result) => {
      if (result == null) {
        var caseTransactionId = 1;
      } else {
        var id = result.caseTransactionId;
        var caseTransactionId = id + 1;
      }
      var CaseTransaction = new Casetransaction({
        "_id": caseTransactionId,
        "caseTransactionId": caseTransactionId,
        "userId": cases.userId,
        "caseTypeId": cases.caseTypeId,
        "severityTypeId": cases.severityTypeId,
        "statusId": 1
      });
      CaseTransaction.save((err, result) => {
        if (err) {
          res.status(403).send({
            sucess: false,
            Error: err
          })
        } else {
          Casetransaction.findOne({
              caseTransactionId: caseTransactionId
            }).populate('userId', {
              _id: 0,
              Name: 1,
              deviceToken: 1
            })
            .populate('caseTypeId', {
              _id: 0,
              caseType: 1
            })
            .populate('severityTypeId', {
              _id: 0,
              Severity: 1,
              SLA: 1
            })
            .populate('statusId', {
              _id: 0,
              Status: 1
            }).exec((err, result) => {
              if (err) {
                res.status(403).send({
                  success: false,
                  Error: err
                })
              } else {
                console.log(result);

                var fcm = new FCM(config.serverKey);

                var message = {
                  registration_ids: [result.userId.deviceToken],
                  // to: regId, // required fill with device token or topics
                  collapse_key: 'your_collapse_key',
                  data: {
                    your_custom_data_key: 'your_custom_data_value'
                  },
                  notification: {
                    title: 'Finger Tips',
                    body: "Hi " + result.userId.Name + ", Your ticket for " + result.caseTypeId.caseType + " is registered Successfully."
                  }
                };
                //callback style
                fcm.send(message, function(err, response) {
                  if (err) {
                    console.log("Something has gone wrong!");
                    console.log(err);
                    res.status(403).send({
                      sucess: false,
                      Error: err
                    })
                  } else {
                    // console.log("Successfully sent with response: ", response);
                    // res.send(response)
                    res.status(200).send({
                      sucess: true,
                      message: 'Sucessfully Submitted the Case',
                      notification: response
                    })
                  }
                });
              }
            });
        }
      });
    });
  } else {
    res.status(400).send({
      sucess: false,
      message: 'Invalid Details'
    });
  }
}
