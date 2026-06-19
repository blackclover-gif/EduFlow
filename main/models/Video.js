const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({

title:String,

description:String,

course:String,

professor:{
type:mongoose.Schema.Types.ObjectId,
ref:'User',
},

videoUrl:String,

hasQuiz:{
type:Boolean,
default:false,
},

createdAt:{
type:Date,
default:Date.now,
},

});

module.exports =
mongoose.model('Video',videoSchema);