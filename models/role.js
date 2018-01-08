var mongoose = require('mongoose');
var roleSchema = mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: [true, "Role name should not be duplicate"]
  },
  description: {
    type: String
  },
  accessType: {
    type: String
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  permissions: {
    users: {
      'create': {
        type: Boolean,
        required: true,
        default: false
      },
      'update': {
        type: Boolean,
        required: true,
        default: false
      },
      'read': {
        type: Boolean,
        required: true,
        default: false
      },
      'delete': {
        type: Boolean,
        required: true,
        default: false
      },
      'list': {
        type: Boolean,
        required: true,
        default: false
      },
      'import': {
        type: Boolean,
        required: true,
        default: false
      },
      'export': {
        type: Boolean,
        required: true,
        default: false
      },
      'activityControl': {
        type: Boolean,
        required: true,
        default: false
      },
    },
    roles: {
      'create': {
        type: Boolean,
        required: true,
        default: false
      },
      'update': {
        type: Boolean,
        required: true,
        default: false
      },
      'read': {
        type: Boolean,
        required: true,
        default: false
      },
      'delete': {
        type: Boolean,
        required: true,
        default: false
      },
      'list': {
        type: Boolean,
        required: true,
        default: false
      },
      'import': {
        type: Boolean,
        required: true,
        default: false
      },
      'export': {
        type: Boolean,
        required: true,
        default: false
      },
      'activityControl': {
        type: Boolean,
        required: true,
        default: false
      },
    }
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
  updatedAt: {
    type: Date,
    default: function() {
      return new Date();
    }
  },
  updatedBy: {
    type: String
  }
});
roleSchema.methods.defaultRoleObjects = function() {
  return [{
    role: "ADMIN",
    description: "Highest access rights in the application",
    // access: "ENABLE",
    accessType: "ADMIN",
    isActive: true,
    permissions: {
      users: {
        'list': true,
        'create': true,
        'update': true,
        'activityControl': true,
        'read': true,
        'delete': true,
        'import': true,
        'export': true
      },
      roles: {
        'list': true,
        'create': true,
        'update': true,
        'activityControl': true,
        'read': true,
        'delete': true,
        'import': true,
        'export': true
      }
    },
    createdBy: "DEFAULT ROLE"
  }, {
    role: "USER",
    description: "User",
    // access: "ENABLE",
    accessType: "USER",
    isActive: true,
    permissions: {
      users: {
        'list': false,
        'create': false,
        'update': false,
        'read': false,
        'delete': false,
        'import': false,
        'export': false
      }
    },
    createdBy: "DEFAULT ROLE"
  }];
};

module.exports = mongoose.model('role', roleSchema);
