var express = require('express');
var router = express.Router();
var User = require('../models/tblUser');
var Severity = require('../models/tblSeverityTypes');
var Casetype = require('../models/tblCaseTypes');
var Casestatus = require('../models/tblCaseStatus');
var Casetransaction = require('../models/tblCaseTransaction');
var CaseAcceptance = require('../models/tblCaseAcceptedMapping');
var config = require('../config');
var FCM = require('fcm-push');

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
              CaseAcceptance.findOne({
                caseAcceptedId: caseAcceptedId
              }).populate('userId', {
                _id: 0,
                Name: 1
              }).exec((err, r) => {
                if (err) {
                  res.status(403).send({
                    sucess: false,
                    Error: err
                  })
                } else {
                  Casetransaction.findOne({
                      caseTransactionId: caseAcceptance.caseTransactionId
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
                    }).exec((err, re) => {
                      if (err) {
                        res.status(403).send({
                          success: false,
                          Error: err
                        });
                      } else {
                        var fcm = new FCM(config.serverKey);

                        var message = {
                          registration_ids: [re.userId.deviceToken],
                          // to: regId, // required fill with device token or topics
                          collapse_key: 'your_collapse_key',
                          data: {
                            your_custom_data_key: 'your_custom_data_value'
                          },
                          notification: {
                            title: 'taGd',
                            body: "Hi " + re.userId.Name + " Your ticket for " + re.caseTypeId.caseType + " is accepted by " + r.userId.Name + " and resolved within " + re.severityTypeId.SLA + "mins."
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
                              message: 'Case Accepted Sucessfully and Changed the Status',
                              notification: response
                            })
                          }
                        });
                      }
                    })
                }
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
        Casetransaction.findOne({
            caseTransactionId: caseresolve.caseTransactionId
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
                  title: 'taGd',
                  body: "Hi " + result.userId.Name + " Your ticket for " + result.caseTypeId.caseType + " is resolved."
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
                    message: 'Status is Updated',
                    notification: response
                  });
                }
              });
            }
          })
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
        res.status(403).send({
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
