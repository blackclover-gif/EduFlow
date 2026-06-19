const {
generateQuiz
} = require('../services/aiService');

const Quiz =
require('../models/Quiz');

exports.generateAIQuiz =
async(req,res)=>{

try{

const {

lectureId,
title,
questionCount,
duration

} = req.body;

if(
!lectureId ||
!title ||
!questionCount ||
!duration
){

return res.status(400).json({
message:'All fields required'
});

}

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

const existing =
await Quiz.findOne({lectureId});

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
message:'AI Quiz Generated',

quiz,

});

}catch(err){

res.status(500).json({
message:err.message
});

}

};