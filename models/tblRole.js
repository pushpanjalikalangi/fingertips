var mongoose = require('mongoose');
var roleSchema = mongoose.Schema({
  RoleId: {
    type: Number,
    required: true,
    unique: [true, "Role Id should not be duplicate"]
  },
  Role:{
    type:String,
    required:true,
    unique:[true, "Role Id should not be duplicate"]
  }
});
module.exports = mongoose.model('tblRole', roleSchema);
