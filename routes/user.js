var express = require('express');
var router = express.Router();
var User = require('../models/tblUser');
var Severity = require('../models/tblSeverityTypes');
var Casetype = require('../models/tblCaseTypes');
var Casestatus = require('../models/tblCaseStatus');
var Casetransaction = require('../models/tblCaseTransaction');

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
          res.status(200).send({
            sucess: true,
            message: 'Sucessfully Submitted the Case'
          })
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
