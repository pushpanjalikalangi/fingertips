var mongoose = require('mongoose');
var notificationSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  notificationId: {
    type: String,
    required: [true, 'User Id is Required'],
    unique: [true, 'User Id must be unique'],
    ref: 'user'
  },
  userId: {
    type: String,
    ref: 'user'
  },
  notification: {
    type: String,
    required: [true, 'notification body is Required']
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
module.exports = mongoose.model('tblNotifications', notificationSchema);
