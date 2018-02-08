var mongoose = require('mongoose');
var severitySchema = mongoose.Schema({
  _id: {
    type: Number
  },
  severityTypeId: {
    type: Number,
    required: true,
    unique: [true, "Severity Type Id should not be duplicate"]
  },
  Severity: {
    type: String,
    required: true,
    trim: true
  },
  SLA: {
    type: Number,
    required: true
  }
});
module.exports = mongoose.model('tblSeverityType', severitySchema);
