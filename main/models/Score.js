
const mongoose =
require('mongoose');

const scoreSchema =
new mongoose.Schema({

studentId:{

type:
mongoose.Schema.Types.ObjectId,

ref:'User',

},

lectureId:String,

score:Number,

totalQuestions:Number,

// QUIZ TIMER TRACKING

startedAt:{

type:Date,

default:Date.now

},

expiresAt:{

type:Date

},

submitted:{

type:Boolean,

default:false

},

createdAt:{

type:Date,

default:Date.now,

},

});

// ONE ATTEMPT ONLY

scoreSchema.index(

{ studentId:1, lectureId:1 },

{ unique:true }

);

module.exports =

mongoose.model(
'Score',
scoreSchema
);

