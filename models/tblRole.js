var mongoose = require('mongoose');
var roleSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  roleId: {
    type: Number,
    required: true,
    unique: [true, "Role Id should not be duplicate"]
  },
  Role: {
    type: String,
    required: true,
    unique: [true, "Role should not be duplicate"]
  }
});
module.exports = mongoose.model('tblRole', roleSchema);
