var mongoose = require('mongoose');
var caseTypeSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  caseTypeId: {
    type: Number,
    required: true,
    unique: [true, "Case Type Id should not be duplicate"]
  },
  caseType: {
    type: String,
    required: true,
    trim: true
  }
});
module.exports = mongoose.model('tblCaseType', caseTypeSchema);
