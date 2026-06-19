const express =
require('express');

const router =
express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const {
  getLeaderboard,
  getAnalytics
} = require('../controllers/scoreController');

// ================= LEADERBOARD =================

router.get(

'/leaderboard/:lectureId',

authMiddleware,

getLeaderboard

);

// ================= ANALYTICS =================

router.get(

'/analytics/:lectureId',

authMiddleware,

getAnalytics

);

router.get('/my-scores', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({
      studentId: req.user.id,
      submitted: true
    });
    res.json({ success: true, scores });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// EXPORT ROUTER

module.exports = router;