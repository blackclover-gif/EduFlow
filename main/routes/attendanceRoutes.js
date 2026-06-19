const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Video      = require('../models/Video');

// ── Mark lecture as watched ──
router.post('/attendance/mark', auth, async (req, res) => {
  try {
    const { lectureId, watchDuration } = req.body;

    // 70% of duration = completed
    const video    = await Video.findById(lectureId);
    const completed = watchDuration > 0;

    const record = await Attendance.findOneAndUpdate(
      { studentId: req.user.id, lectureId },
      {
        studentId:     req.user.id,
        lectureId,
        watchedAt:     new Date(),
        watchDuration,
        completed,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, record });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Get my attendance ──
router.get('/attendance/my', auth, async (req, res) => {
  try {
    const records = await Attendance.find({
      studentId: req.user.id
    }).populate('lectureId', 'title course');

    res.json({ success: true, records });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Professor: get attendance for a lecture ──
router.get('/attendance/lecture/:lectureId', auth, async (req, res) => {
  try {
    const records = await Attendance.find({
      lectureId: req.params.lectureId
    }).populate('studentId', 'name email');

    res.json({ success: true, records });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;