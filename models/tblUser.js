var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  UserId: {
    type: Number,
    required: [true, 'User Id is Required'],
    unique: [true, 'User Id must be unique']
  },
  RoleId: {
    type: Number,
    required: [true, 'User Name is Required']
  },
  Name: {
    type: String,
    required: [true, 'User Name is Required'],
    unique: [true, 'User Id must be unique'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is Required']
  },
  MobileNumber: {
    type: String,
    required: [true, 'MobileNumber is Required'],
    unique: [true, 'MobileNumber must be unique']
  },
  EmailId: {
    type: String,
    required: [true, 'EmailId is Required'],
    unique: [true, 'EmailId must be unique']
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
