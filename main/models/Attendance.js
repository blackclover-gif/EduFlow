const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },

  watchedAt: {
    type: Date,
    default: Date.now,
  },

  watchDuration: {
    type: Number, // seconds watched
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

// One record per student per lecture
attendanceSchema.index(
  { studentId: 1, lectureId: 1 },
  { unique: true }
);

module.exports =
  mongoose.model('Attendance', attendanceSchema);