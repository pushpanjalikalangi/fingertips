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
  options1: {
    type: String,
    trim: true
  },
  options2: {
    type: String,
    trim: true
  },
  options3: {
    type: String,
    trim: true
  },
  options4: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('poll', pollSchema);
