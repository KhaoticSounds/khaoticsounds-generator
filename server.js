const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow CORS only from your frontend domain
app.use(cors({
  origin: 'https://www.khaoticsounds.com'
}));

app.use(bodyParser.json());
app.use(express.static('public')); // serve index.html and frontend files

// AI generation endpoint
app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Write ${bars} bars of lyrics in a ${mood} style. Theme: ${prompt}. Match a BPM of ${bpm}.`
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    console.log('OpenAI Response:', data); // 🔍 log full response for debugging

    const lyrics = data.choices?.[0]?.message?.content?.trim();
    if (!lyrics) {
      throw new Error('No lyrics returned from OpenAI');
    }

    res.json({ lyrics });
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({ lyrics: '' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
