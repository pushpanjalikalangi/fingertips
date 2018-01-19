var Poll = require('../models/poll');
var User = require('../models/user');

exports.createPoll = (req, res) => {
  try {
    if (req.body) {
      var poll = new Poll(req.body);
      // or
      // var poll = new Poll({
      //   pollId: req.body.pollId,
      //   Poll: req.body.Poll,
      //   Deadline: req.body.Deadline,
      //   options1: req.body.options1,
      //   options2: req.body.options2,
      //   options3: req.body.options3,
      //   options4: req.body.options4,
      //   createdBy: req.body.createdBy,
      //   comments: req.body.comments
      // });
      poll.save((err, poll) => {
        try {
          if (err) {
            res.status(403).send({
              sucess: false,
              error: err,
              message: 'Error in creating the poll'
            })
          } else {
            res.status(200)
              .send({
                sucess: true,
                message: 'Poll created Succefully',
                poll: poll
              });
          }
        } catch (e) {
          res.status(403).send({
            sucess: false,
            message: 'Internal Server Error'
          })
        }
      })
    } else {
      res.status(403).send({
        sucess: false,
        message: 'Invalid Details'
      })
    }

  } catch (e) {
    console.log("createPoll Error", e);
    res.status(500).send({
      sucess: false,
      response: res,
      error: e,
      message: 'Internal server Error'
    });
  }
}
exports.submitPoll = (req, res) => {
  try {
    if (req.body) {
      Poll.findOne({
        pollId: req.body.pollId
      }).exec((err, result) => {
        if (err) {
          res.status(403).send({
            sucess: false,
            err: err
          });
        } else if (!result) {
          res.status(403).send({
            sucess: false,
            message: 'Poll is not defined with that' + req.body.pollId + "."
          });
        } else {
          User.update({
            "$or": [{
              MobileNumber: req.body.createdBy
            }, {
              flatNumber: req.body.createdBy
            }]
          }, {
            $push: {
              poll: {
                pollId: req.body.pollId,
                comments: req.body.comments,
                answer: req.body.answer
              }
            }
          }).exec((err, result1) => {
            if (err) {
              console.log("Error in updating the poll answer to user");
              res.status(403).send({
                success: false,
                Error: err
              })
            } else {
              res.status(200).send({
                success: true,
                message: 'Poll is submitted Succefully'
              })
            }
          })
        }
      });
    } else {
      res.status(403).send({
        success: false,
        message: 'Invalid Details'
      });
    }
  } catch (e) {
    console.log("submitPoll Error", e);
    res.status(500).send({
      success: false,
      response: res,
      error: e,
      message: 'Internal server Error'
    });
  }
};
exports.countPolling = (req, res) => {
  try {
    if (req.body) {
      User.find({
        "$and": [{
          "poll.pollId": req.body.pollId
        }, {
          "poll.answer": req.body.answer
        }]
      }, {
        _id: 0,
        poll: 1
      }).exec((err, results) => {
        try {
          if (err) {
            res.status(403).send({
              success: false,
              message: 'Fetching user details'
            })
          } else {
            res.status(200).send({
              success: true,
              pollResult: results
            })
          }
        } catch (e) {
          res.status(500).send({
            success: false,
            message: 'Internal server Error'
          });
        }
      })
    } else {
      res.status(403).send({
        success: false,
        message: 'Incorrect details'
      })
    }
  } catch (e) {
    console.log("countPoll Error", e);
    res.status(500).send({
      success: false,
      response: res,
      error: e,
      message: 'Intrnal server Error'
    })
  }
}
