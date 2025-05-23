const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Make sure your index.html, style.css, and script.js are in /public

app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Write ${bars} bars of lyrics in a ${mood} style. Theme: ${prompt}. Match a BPM of ${bpm}.`,
          },
        ],
        temperature: 0.8,
      }),
    });

    const data = await openaiResponse.json();
    const lyrics = data.choices?.[0]?.message?.content?.trim() || 'No lyrics returned.';
    res.json({ lyrics });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate lyrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
