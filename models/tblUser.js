var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  userId: {
    type: Number,
    required: [true, 'User Id is Required'],
    unique: [true, 'User Id must be unique']
  },
  roleId: {
    type: Number,
    required: [true, 'User Name is Required']
  },
  deviceToken: {
    type: String,
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
  mobileNumber: {
    type: String,
    required: [true, 'MobileNumber is Required']
  },
  emailId: {
    type: String,
    required: [true, 'EmailId is Required']
  },
  isActive: {
    type: Boolean,
    required: [true, 'Activity status is Required'],
    trim: true,
    default: true
  },
  createdTime: {
    type: Date,
    required: true,
    default: function() {
      return new Date();
    }
  }
});
module.exports = mongoose.model('user', userSchema);
