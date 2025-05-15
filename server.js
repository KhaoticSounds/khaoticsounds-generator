// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-lyrics', async (req, res) => {
  const { prompt } = req.body;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a rap lyric generator that creates catchy, punchy, and creative lyrics based on user input. Keep it within the selected bar count and reflect the mood and BPM style if mentioned.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 300,
      })
    });

    const openaiData = await openaiRes.json();
    const lyrics = openaiData.choices?.[0]?.message?.content || '';
    res.json({ lyrics });
  } catch (error) {
    console.error('Error generating lyrics:', error);
    res.status(500).json({ lyrics: 'Error generating lyrics' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
