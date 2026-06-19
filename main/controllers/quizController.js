
const Quiz =
require('../models/Quiz');

const Score =
require('../models/Score');

// ================= CREATE QUIZ =================

exports.createQuiz =
async(req,res)=>{

try{

const {
lectureId,
duration,
questions
} = req.body;

const existing =
await Quiz.findOne({
lectureId
});

if(existing){

return res.status(400).json({
message:'Quiz Already Exists'
});

}

const quiz =
await Quiz.create({

lectureId,
duration,
questions,

});

res.status(201).json({

success:true,
message:'Quiz Created',
quiz,

});

}catch(err){

console.log(err);

res.status(500).json({
message:err.message
});

}

};

// ================= GET QUIZ =================

exports.getQuiz =
async(req,res)=>{

try{

const quiz =
await Quiz.findOne({

lectureId:
req.params.lectureId

});

if(!quiz){

return res.status(404).json({
message:'Quiz Not Found'
});

}

if(req.user.role === 'student'){

const safeQuiz = {

_id:quiz._id,

lectureId:
quiz.lectureId,

duration:
quiz.duration,

questions:
quiz.questions.map(q=>({

question:q.question,

options:q.options,

})),

};

return res.json(safeQuiz);

}

res.json(quiz);

}catch(err){

console.log(err);

res.status(500).json({
message:err.message
});

}

};

// ================= START QUIZ =================

exports.startQuiz =
async(req,res)=>{

try{

const { lectureId } = req.body;

const quiz =
await Quiz.findOne({
lectureId
});

if(!quiz){

return res.status(404).json({
message:'Quiz Not Found'
});

}

// CHECK EXISTING SESSION

let existingAttempt =
await Score.findOne({

studentId:req.user.id,

lectureId,

});

// IF QUIZ ALREADY STARTED


if(existingAttempt){

// CREATE TIMER IF MISSING

if(!existingAttempt.expiresAt){

existingAttempt.startedAt =
new Date();

existingAttempt.expiresAt =
new Date(

Date.now() +
quiz.duration * 60 * 1000

);

await existingAttempt.save();

}

return res.json({

success:true,

startedAt:
existingAttempt.startedAt,

expiresAt:
existingAttempt.expiresAt,

});

}



// CREATE TIMER

const startedAt =
new Date();

const expiresAt =
new Date(

Date.now() +
quiz.duration * 60 * 1000

);

// CREATE ATTEMPT

await Score.create({

studentId:req.user.id,

lectureId,

score:0,

totalQuestions:
quiz.questions.length,

startedAt,

expiresAt,

submitted:false,

});

res.json({

success:true,

startedAt,

expiresAt,

});

}catch(err){

console.log(err);

res.status(500).json({
message:err.message
});

}

};

// ================= SUBMIT QUIZ =================

exports.submitQuiz =
async(req,res)=>{

try{

const {
lectureId,
answers
} = req.body;

const attempt =
await Score.findOne({

studentId:req.user.id,

lectureId,

});

if(!attempt){

return res.status(400).json({
message:'Quiz not started'
});

}

// BLOCK RESUBMISSION

if(attempt.submitted){

return res.status(400).json({
message:'Already Submitted'
});

}

// CHECK TIMER

if(new Date() > attempt.expiresAt){

attempt.submitted = true;

await attempt.save();

return res.status(400).json({
message:'Time Over'
});

}

const quiz =
await Quiz.findOne({
lectureId
});

if(!quiz){

return res.status(404).json({
message:'Quiz Not Found'
});

}

// CALCULATE SCORE

let score = 0;

quiz.questions.forEach((q,index)=>{

if(
q.correctAnswer
=== answers[index]
){
score++;
}

});

// UPDATE SCORE

attempt.score = score;

attempt.submitted = true;

await attempt.save();

// SEND RESULT

res.json({

success:true,

message:'Quiz Submitted',

score,

totalQuestions:
quiz.questions.length,

percentage:
(
(score /
quiz.questions.length)
* 100
).toFixed(2)

});

}catch(err){

console.log(err);

res.status(500).json({
message:err.message
});

}

};
// ================= DELETE QUIZ =================

exports.deleteQuiz =
async(req,res)=>{

  try{

    const quiz =
    await Quiz.findOneAndDelete({
      lectureId: req.params.lectureId
    });

    if(!quiz){
      return res.status(404).json({
        message:'Quiz Not Found'
      });
    }

    res.json({
      success: true,
      message: 'Quiz Deleted'
    });

  }catch(err){

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

};

module.exports = {

  createQuiz: exports.createQuiz,

  getQuiz: exports.getQuiz,

  submitQuiz: exports.submitQuiz,

  startQuiz: exports.startQuiz,

  deleteQuiz: exports.deleteQuiz

};