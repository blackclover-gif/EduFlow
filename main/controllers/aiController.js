
const { generateQuiz } =
require('../services/aiService');

const Quiz =
require('../models/Quiz');

const generateAIQuiz =
async(req,res)=>{

try{

const {
lectureId,
title,
questionCount,
duration
} = req.body;

// CHECK EXISTING QUIZ

const existingQuiz =
await Quiz.findOne({
lectureId
});

if(existingQuiz){

return res.status(400).json({
message:'Quiz already exists for this lecture'
});

}

// GENERATE QUESTIONS

const aiResponse =
await generateQuiz(
title,
questionCount
);

const cleaned =
aiResponse
.replace(/```json/g,'')
.replace(/```/g,'');

const questions =
JSON.parse(cleaned);

// CREATE QUIZ

const quiz =
await Quiz.create({

lectureId,
duration,
questions,

});

// SUCCESS RESPONSE

res.status(201).json({

success:true,
message:'AI Quiz Generated',
quiz,

});

}catch(err){

console.log(err);

res.status(500).json({
message:err.message
});

}

};

module.exports = {
generateAIQuiz
};





