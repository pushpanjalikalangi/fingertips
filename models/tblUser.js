var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  UserId: {
    type: Number,
    required: [true, 'User Id is Required'],
    unique: [true, 'User Id must be unique']
  },
  RoleId: {
    type: Number
  },
  Name: {
    type: String,
    required: [true, 'User Name is Required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is Required']
  },
  IsActive: {
    type: Boolean,
    required: [true, 'Activity status is Required'],
    trim: true,
    default: true
  },
  CreatedTime: {
    type: Date,
    required: true,
    default: function() {
      return new Date();
    }
  }
});
module.exports = mongoose.model('user', userSchema);
