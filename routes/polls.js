var Poll = require('../models/poll');

exports.createPoll = (req, res) => {
  try {
    if (req.body) {
      var poll = new Poll(req.body);
      poll.save((err, poll) => {
        console.log(poll);
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

      var comments = {
        commentedBy: req.body.MobileNumber,
        comment: req.body.comment
      }
      Poll.update({
        _id: req.params.id
      }, {
        $addToSet: {
          comments: comments
        }
      }).exec((err, poll) => {
        try {
          if (err) {
            res.status(403)
              .send({
                sucess: false,
                Error: err
              })
          } else {
            res.status(200)
              .send({
                success: true,
                message: 'Poll is Submitted Succefully'
              })
          }
        } catch (e) {
          console.log("submitPoll Error", e);
          res.status(500).send({
            sucess: false,
            response: res,
            error: e,
            message: 'Error in Submitting the poll'
          });
        }

      })

    } else {
      res.status(403).send({
        sucess: false,
        message: 'Invalid Details'
      });
    }
  } catch (e) {
    console.log("submitPoll Error", e);
    res.status(500).send({
      sucess: false,
      response: res,
      error: e,
      message: 'Internal server Error'
    });
  }
}
