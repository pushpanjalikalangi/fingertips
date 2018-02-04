var express = require('express');
var router = express.Router();
var User = require('../models/tblUser');
var Severity = require('../models/tblSeverityTypes');
var Casetype = require('../models/tblCaseTypes');
var Casestatus = require('../models/tblCaseStatus');
var Casetransaction = require('../models/tblCaseTransaction');
var CaseAcceptance = require('../models/tblCaseAcceptedMapping');

exports.caseAccept = (req, res) => {
  if (req.body) {
    var caseAcceptance = req.body;
    Casetransaction.findOneAndUpdate({
      CaseTransactionId: caseAcceptance.CaseTransactionId
    }, {
      $set: {
        StatusId: 2
      }
    }).exec((err, Case) => {
      if (err) {
        res.status(403).send({
          sucess: false,
          Error: err
        })
      } else {
        CaseAcceptance.findOne().sort({
          _id: -1
        }).limit(1).exec((err, result) => {
          if (result == null) {
            var CaseAcceptedId = 1;
          } else {
            var id = result.CaseAcceptedId;
            var CaseAcceptedId = id + 1;
          }
          var caseAccept = new CaseAcceptance({
            _id: caseAcceptance.CaseAcceptedId,
            CaseAcceptedId: caseAcceptance.CaseAcceptedId,
            CaseTransactionId: caseAcceptance.CaseTransactionId,
            UserId: caseAcceptance.UserId
          });
          caseAccept.save((err, result) => {
            if (err) {
              res.status(403).send({
                sucess: false,
                Error: err
              })
            } else {
              res.status(200).send({
                sucess: true,
                message: 'Case Accepted Sucessfully and Changed the status'
              })
            }
          })
        });
      }
    })
  } else {
    res.status(400).send({
      sucess: false,
      message: 'Invalid Details'
    });
  }
}
exports.caseResolve = (req, res) => {
  if (req.body) {
    var caseresolve = req.body;
    Casetransaction.findOneAndUpdate({
      CaseTransactionId: caseresolve.CaseTransactionId
    }, {
      $set: {
        StatusId: 3
      }
    }).exec((err, Case) => {
      console.log(Case);
      if (err) {
        res.status(403).send({
          sucess: false,
          Error: err
        });
      } else {
        res.status(200).send({
          sucess: true,
          message: 'Status is updated'
        });
      }
    });
  } else {
    res.status(400).send({
      sucess: false,
      message: 'Invalid Details'
    });
  }
}
