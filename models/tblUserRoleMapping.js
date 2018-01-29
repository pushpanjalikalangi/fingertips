var mongoose = require('mongoose');
var roleSchema = mongoose.Schema({
  UserRoleId: {
    type: Number,
    required: true
  },
  UserId: {
    type: Number,
    required: true,
    unique: [true, "User Id should not be duplicate"]
  },
  RoleId: {
    type: Number,
    required: true
  },
  CreatedTime: {
    type: Date,
    required: true,
    default: function() {
      return new Date();
    }
  }
});
module.exports = mongoose.model('tblRole', roleSchema);
