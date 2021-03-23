const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  city: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  approved: {
    type: Boolean,
    default: false
  },
  adminAccount: {
    type: Boolean,
    default: false
  },
  fabricUsername: {
    type: String
  },
  fabricAccount: {
    type: Boolean,
    default: false
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
