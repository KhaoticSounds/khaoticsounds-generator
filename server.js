require('dotenv').config();
const express = require('express');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint to generate lyrics
app.post('/api/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;
  const fullPrompt = `Generate ${bars} bars of ${mood} rap lyrics at ${bpm} BPM based on: ${prompt}`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: fullPrompt }],
    });

    const lyrics = chatCompletion.choices[0].message.content;
    res.json({ lyrics });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate lyrics' });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
