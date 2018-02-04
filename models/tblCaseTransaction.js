var mongoose = require('mongoose');
var caseTransactionSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  CaseTransactionId: {
    type: Number,
    required: true,
    unique: [true, "Case Transaction Id should not be duplicate"]
  },
  UserId: {
    type: Number,
    required: true,
    ref: 'user'
  },
  CaseTypeId: {
    type: Number,
    required: true,
    ref: 'tblCaseType'
  },
  SeverityTypeId: {
    type: Number,
    required: true,
    ref: 'tblSeverityType'
  },
  StatusId: {
    type: Number,
    required: true,
    ref: 'tblCaseStatus'
  },
  CreatedTime: {
    type: Date,
    required: true,
    default: function() {
      return new Date();
    }
  }
});
module.exports = mongoose.model('tblCaseTransaction', caseTransactionSchema);
