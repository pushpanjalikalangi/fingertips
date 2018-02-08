var mongoose = require('mongoose');
var caseStatusSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  statusId: {
    type: Number,
    required: true,
    unique: [true, "Case Type Id should not be duplicate"]
  },
  Status: {
    type: String,
    required: true,
  },
  statusDescription: {
    type: String,
    required: true,
    trim: true
  }
});
module.exports = mongoose.model('tblCaseStatus', caseStatusSchema);
