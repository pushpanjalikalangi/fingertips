var mongoose = require('mongoose');
var caseAcceptedMapping = mongoose.Schema({
  _id: {
    type: Number
  },
  CaseAcceptedId: {
    type: Number,
    required: true,
    unique: [true, "Case Acceptance Id should not be duplicate"]
  },
  UserId: {
    type: Number,
    required: true,
    ref: 'user'
  },
  CaseTransactionId: {
    type: Number,
    required: true,
    ref: 'tblCaseTransaction'
  },
  CreatedTime: {
    type: Date,
    required: true,
    default: function() {
      return new Date();
    }
  }
});
module.exports = mongoose.model('tblcaseAccepted', caseAcceptedMapping);
