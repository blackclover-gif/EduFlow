
const Score =
require('../models/Score');

const User =
require('../models/User');

// ================= ANALYTICS =================

exports.getAnalytics =
async(req,res)=>{

  try{

    const scores =
    await Score.find({
      lectureId: req.params.lectureId,
      submitted: true
    }).populate('studentId', 'name');

    if(scores.length === 0){
      return res.json({
        success: true,
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
        distribution: [],
        students: []
      });
    }

    const total = scores.length;

    const percentages = scores.map(s =>
      parseFloat(((s.score / s.totalQuestions) * 100).toFixed(1))
    );

    const avg = (percentages.reduce((a,b) => a+b, 0) / total).toFixed(1);
    const highest = Math.max(...percentages);
    const lowest  = Math.min(...percentages);
    const passed  = percentages.filter(p => p >= 50).length;
    const passRate = ((passed / total) * 100).toFixed(1);

    // Score distribution buckets
    const buckets = [
      { label: '0-20%',  min:0,  max:20,  count:0 },
      { label: '21-40%', min:21, max:40,  count:0 },
      { label: '41-60%', min:41, max:60,  count:0 },
      { label: '61-80%', min:61, max:80,  count:0 },
      { label: '81-100%',min:81, max:100, count:0 },
    ];

    percentages.forEach(p => {
      const bucket = buckets.find(b => p >= b.min && p <= b.max);
      if(bucket) bucket.count++;
    });

    const students = scores.map((s, i) => ({
      name:       s.studentId?.name || 'Unknown',
      score:      s.score,
      total:      s.totalQuestions,
      percentage: percentages[i]
    })).sort((a,b) => b.percentage - a.percentage);

    res.json({
      success:       true,
      totalAttempts: total,
      averageScore:  avg,
      highestScore:  highest,
      lowestScore:   lowest,
      passRate,
      distribution:  buckets,
      students
    });

  }catch(err){
    res.status(500).json({ message: err.message });
  }

};

// ================= LEADERBOARD =================

exports.getLeaderboard =
async(req,res)=>{

try{

const scores =
await Score.find({

lectureId:
req.params.lectureId

})

.sort({score:-1})

.populate(
'studentId',
'name'
);

const leaderboard =
scores.map((s,index)=>({

rank:index + 1,

student:
s.studentId.name,


score:
`${s.score}/${s.totalQuestions}`



}));

res.json({

success:true,

leaderboard,

});

}catch(err){

res.status(500).json({
message:err.message
});

}

};
