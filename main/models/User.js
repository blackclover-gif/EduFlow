const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type:     String,
    required: true,
  },

  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
    trim:      true,
  },

  password: {
    type:     String,
    required: true,
  },

  role: {
    type: String,
    enum: ['student', 'professor'],
    required: true,
  },

  // ── Email verification ──
  isVerified: {
    type:    Boolean,
    default: false,
  },

  // ── OTP fields ──
  otp: {
    type:    String,
    default: null,
  },

  otpExpiry: {
    type:    Date,
    default: null,
  },

  otpType: {
    type:    String,
    enum:    ['verify', 'reset', null],
    default: null,
  },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);