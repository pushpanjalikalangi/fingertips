var express = require('express');
var router = express.Router();
var User = require('../models/tblUser');
var Severity = require('../models/tblSeverityTypes');
var Casetype = require('../models/tblCaseTypes');
var Casestatus = require('../models/tblCaseStatus');
var Casetransaction = require('../models/tblCaseTransaction');
var CaseAcceptance = require('../models/tblCaseAcceptedMapping');

exports.searchCase = (req, res) => {
  if (req.body) {
    Casetransaction.findOne({
        caseTransactionId: req.body.id
      })
      .populate('UserId', {
        _id: 0,
        Name: 1
      })
      .populate('CaseTypeId', {
        _id: 0,
        caseType: 1
      })
      .populate('SeverityTypeId', {
        _id: 0,
        Severity: 1,
        SLA: 1
      })
      .populate('StatusId', {
        _id: 0,
        Status: 1
      }).exec((err, result) => {
        if (err) {
          res.status(403).send({
            sucess: false,
            Error: err
          });
        } else if (result == null) {
          res.status(403).send({
            sucess: false,
            message: "Case is not Registered with that Id"
          });
        } else {
          CaseAcceptance.findOne({
            caseTransactionId: req.body.id //it accepts only _id when we use populate()
          }, {
            _id: 0,
            userId: 1
          }).exec((err, doc) => {
            if (err) {
              res.status(403).send({
                sucess: false,
                Error: err
              });
            } else if (doc == null) {
              res.status(200).send({
                sucess: true,
                result: result,
                Assignedstaff: "Not Assigned to Any Staff"
              })
            } else {
              res.status(200).send({
                sucess: true,
                result: result,
                Assignedstaff: doc
              })
            }
          })
        }
      })
  } else {
    res.status(400).send({
      sucess: false,
      message: "Invalid Details"
    })
  }
}
