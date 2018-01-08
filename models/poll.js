var mongoose = require('mongoose');
var pollSchema = mongoose.Schema({
  pollId: {
    type: Number,
    required: [true, 'pollId is Required'],
    unique: [true, 'pollId must be Unique']
  },
  Poll: {
    type: String,
    required: [true, 'Polling Description is Required']
  },
  Deadline: {
    type: Date,
    required: [true, 'Deadline is Required']
  },
  createdAt: {
    type: Date,
    default: function() {
      return new Date();
    }
  },
  createdBy: {
    type: String,
    required: true
  },
  comments: {
    type: Array
  },
  Accept: {
    type: Boolean
  },
  Reject: {
    type: Boolean
  }
});
module.exports = mongoose.model('poll', pollSchema);
