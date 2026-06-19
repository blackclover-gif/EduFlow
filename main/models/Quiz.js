const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({

lectureId:{
type:String,
required:true,
unique:true,
},

duration:Number,

questions:[{

question:String,

options:[String],

correctAnswer:String,

}],

});

module.exports =
mongoose.model('Quiz',quizSchema);