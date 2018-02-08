var mongoose = require('mongoose');
var caseAcceptedMapping = mongoose.Schema({
  _id: {
    type: Number
  },
  caseAcceptedId: {
    type: Number,
    required: true,
    unique: [true, "Case Acceptance Id should not be duplicate"]
  },
  userId: {
    type: Number,
    required: true,
    ref: 'user'
  },
  caseTransactionId: {
    type: Number,
    required: true,
    ref: 'tblCaseTransaction'
  },
  createdTime: {
    type: Date,
    required: true,
    default: function() {
      return new Date();
    }
  }
});
module.exports = mongoose.model('tblcaseAccepted', caseAcceptedMapping);
