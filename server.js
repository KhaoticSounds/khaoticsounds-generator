const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow specific origins for CORS
const allowedOrigins = [
  'https://www.khaoticsounds.com',
  'https://khaoticsounds-generator-production.up.railway.app'
];

// ✅ Custom CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // ✅ Handle preflight
  }

  next();
});

app.use(bodyParser.json());
app.use(express.static('public')); // ✅ Serve frontend files if needed

// ✅ POST /generate: Get lyrics from OpenAI
app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY in environment");
    return res.status(500).json({ lyrics: '' });
  }

  console.log("📥 Request to /generate:", req.body);

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
    console.log('✅ OpenAI response:', data);

    const lyrics = data.choices?.[0]?.message?.content?.trim();
    if (!lyrics) throw new Error('No lyrics returned');

    res.json({ lyrics });
  } catch (error) {
    console.error('❌ OpenAI error:', error.message);
    res.status(500).json({ lyrics: '' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
