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
      caseTransactionId: caseAcceptance.caseTransactionId
    }, {
      $set: {
        statusId: 2,
        updatedTime: new Date()
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
            var caseAcceptedId = 1;
          } else {
            var id = result.caseAcceptedId;
            var caseAcceptedId = id + 1;
          }
          var caseAccept = new CaseAcceptance({
            _id: caseAcceptedId,
            caseAcceptedId: caseAcceptedId,
            caseTransactionId: caseAcceptance.caseTransactionId,
            userId: caseAcceptance.userId
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
                message: 'Case Accepted Sucessfully and Changed the Status'
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
      caseTransactionId: caseresolve.caseTransactionId
    }, {
      $set: {
        statusId: 3
      }
    }).exec((err, Case) => {
      if (err) {
        res.status(403).send({
          sucess: false,
          Error: err
        });
      } else {
        res.status(200).send({
          sucess: true,
          message: 'Status is Updated'
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
exports.staffHome = (req, res) => {
  try {
    Casetransaction.find({
      statusId: 1
    }).populate('userId', {
      _id: 0,
      Name: 1
    }).populate('severityTypeId', {
      _id: 0,
      Severity: 1,
      SLA: 1
    }).populate('caseTypeId', {
      _id: 0,
      caseType: 1
    }).populate('statusId', {
      _id: 0,
      statusId: 1,
      Status: 1
    }).exec((err, result) => {
      if (err) {
        res.status(403).send({
          sucess: false,
          message: 'Error in Fetching the Details',
          Error: err
        });
      } else if (result.length == 0) {
        res.status(200).send({
          sucess: false,
          message: 'No Active Cases are Present',
        });
      } else {
        res.status(200).send({
          sucess: true,
          cases: result
        })
      }
    })
  } catch (e) {
    res.status(400).send({
      sucess: false,
      message: 'Internal Server Error'
    });
  }
}
exports.acceptCases = (req, res) => {
  try {
    Casetransaction.find({
      statusId: 2
    }).populate('userId', {
      _id: 0,
      Name: 1
    }).populate('severityTypeId', {
      _id: 0,
      Severity: 1,
      SLA: 1
    }).populate('caseTypeId', {
      _id: 0,
      caseType: 1
    }).populate('statusId', {
      _id: 0,
      statusId: 1,
      Status: 1
    }).exec((err, result) => {
      if (err) {
        res.status(403).send({
          sucess: false,
          message: 'Error in Fetching the Details',
          Error: err
        });
      } else if (result.length == 0) {
        res.status(200).send({
          sucess: false,
          message: 'No Accepted Cases are Present',
        });
      } else {
        res.status(200).send({
          sucess: true,
          cases: result
        })
      }
    })
  } catch (e) {
    res.status(400).send({
      sucess: false,
      message: 'Internal Server Error'
    });
  }
}
exports.home = (req, res) => {
  try {
    Casetransaction.find({
      $or: [{
          statusId: 2
        },
        {
          statusId: 1
        }
      ]
    }).populate('userId', {
      _id: 0,
      Name: 1
    }).populate('severityTypeId', {
      _id: 0,
      Severity: 1,
      SLA: 1
    }).populate('caseTypeId', {
      _id: 0,
      caseType: 1
    }).populate('statusId', {
      _id: 0,
      statusId: 1,
      Status: 1
    }).sort({
      updatedTime: 1
    }).exec((err, result) => {
      if (err) {
        res.status(403).send({
          sucess: false,
          message: 'Error in Fetching the Details',
          Error: err
        });
      } else if (result.length == 0) {
        res.status(200).send({
          sucess: false,
          message: 'No Cases are Present',
        });
      } else {
        res.status(200).send({
          sucess: true,
          cases: result
        })
      }
    })
  } catch (e) {
    res.status(400).send({
      sucess: false,
      message: 'Internal Server Error'
    });
  }
}
