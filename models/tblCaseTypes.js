var mongoose = require('mongoose');
var caseTypeSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  CaseTypeId: {
    type: Number,
    required: true,
    unique: [true, "Case Type Id should not be duplicate"]
  },
  CaseType: {
    type: String,
    required: true,
    trim: true
  }
});
module.exports = mongoose.model('tblCaseType', caseTypeSchema);
