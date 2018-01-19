var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  MobileNumber: {
    type: String,
    required: [true, 'User mobile number is Required'],
    match: [/^\d{10}$/, 'Invalid mobile number ..!'],
    unique: [true, 'Mobile Number must be unique']
  },
  firstName: {
    type: String,
    required: [true, 'User first name is Required'],
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  flatNumber: {
    type: String,
    required: [true, 'User flat Number is Required'],
    unique: [true, 'Flat Number must be unique']
  },
  password: {
    type: String,
    required: true
  },
  poll: {
    type: Array
  }
  // role: {
  //   type: String,
  //   required: [true, 'User Role is Required'],
  //   trim: true
  // }
});
module.exports = mongoose.model('user', userSchema);
