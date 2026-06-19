const express = require('express');

const router = express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const professorMiddleware =
require('../middleware/roleMiddleware');

const {
  createQuiz,
  getQuiz,
  submitQuiz,
  startQuiz,
  deleteQuiz
} = require('../controllers/quizController');

// ================= CREATE QUIZ =================

router.post(

'/quizzes',

authMiddleware,

professorMiddleware,

createQuiz

);

// ================= GET QUIZ =================

router.get(

'/quizzes/:lectureId',

authMiddleware,

getQuiz

);

// ================= START QUIZ =================

router.post(

'/quiz/start',

authMiddleware,

startQuiz

);

// ================= SUBMIT QUIZ =================

router.post(

'/quiz/submit',

authMiddleware,

submitQuiz

);

// ================= DELETE QUIZ =================

router.delete(

'/quizzes/:lectureId',

authMiddleware,

professorMiddleware,

deleteQuiz

);

// EXPORT ROUTER

module.exports = router;