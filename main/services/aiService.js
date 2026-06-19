
const generateQuiz =
async(title,questionCount)=>{

const questions = [];

const answers = [
'Option A',
'Option B',
'Option C',
'Option D'
];

for(let i=1;i<=questionCount;i++){

const randomAnswer =
answers[
Math.floor(Math.random()*4)
];

questions.push({

question:
`${title} Question ${i}`,

options:[
'Option A',
'Option B',
'Option C',
'Option D'
],

correctAnswer:
randomAnswer

});

}

return JSON.stringify(questions);

};

module.exports = {
generateQuiz
};

