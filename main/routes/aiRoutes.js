const express = require('express');
const router = express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const professorMiddleware =
require('../middleware/roleMiddleware');

const { GoogleGenerativeAI } =
require('@google/generative-ai');

const genAI =
new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post(
'/ai/generate-quiz',
authMiddleware,
professorMiddleware,
async (req, res) => {

  const { transcript, numQuestions = 5 } = req.body;

  if (!transcript) {
    return res.status(400).json({
      success: false,
      message: 'Transcript is required'
    });
  }

  try {

    const model =
    genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const prompt = `
You are a quiz generator.

Based on the lecture content below, generate exactly ${numQuestions} multiple choice questions.

Return ONLY a valid JSON array.

NO markdown.
NO code fences.
NO explanation.

Each object must contain:
- "question"
- "options" (array of exactly 4 strings)
- "correctAnswer"

Lecture:
${transcript}
`;

    const result =
    await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],

      generationConfig: {
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    });

    const text =
    await result.response.text();

    console.log(
      'RAW GEMINI RESPONSE:',
      text
    );

    const clean = text
      .replace(
        /<thinking>[\s\S]*?<\/thinking>/g,
        ''
      )
      .replace(/```json|```/g, '')
      .trim();

    const match =
    clean.match(/\[[\s\S]*\]/);

    if (!match) {
      throw new Error(
        'No JSON array in response'
      );
    }

    const questions =
    JSON.parse(match[0]);

    res.json({
      success: true,
      questions
    });

  } catch (err) {

    console.error(
      'Gemini Error:',
      err
    );

    res.status(500).json({
      success: false,
      message:
      'AI generation failed: ' +
      err.message
    });

  }

});

module.exports = router;