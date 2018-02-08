var mongoose = require('mongoose');
var caseTransactionSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  caseTransactionId: {
    type: Number,
    required: true,
    unique: [true, "Case Transaction Id should not be duplicate"]
  },
  userId: {
    type: Number,
    required: true,
    ref: 'user'
  },
  caseTypeId: {
    type: Number,
    required: true,
    ref: 'tblCaseType'
  },
  severityTypeId: {
    type: Number,
    required: true,
    ref: 'tblSeverityType'
  },
  statusId: {
    type: Number,
    required: true,
    ref: 'tblCaseStatus'
  },
  createdTime: {
    type: Date,
    required: true,
    default: function() {
      return new Date();
    }
  }
});
module.exports = mongoose.model('tblCaseTransaction', caseTransactionSchema);
