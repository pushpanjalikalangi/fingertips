var jwt = require('jsonwebtoken');
var config = require('../config');

exports.islogged = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token ||
    req.headers['token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.jwtsecret, function(err, decoded) {
      if (err) {
        return res.status(403)
          .json({
            message: "Invalid Security Token"
          });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        ID = decoded.account_id;
        next();
      }
    });

  } else {
    // if Invalid token
    // returns an error
    return res.status(403)
      .send({
        success: false,
        message: 'Invalid Security Token'
      });

  }

}
