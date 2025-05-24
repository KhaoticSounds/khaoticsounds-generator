const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080; // Railway uses 8080 by default

// ✅ Enable CORS for frontend communication
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ✅ Body parser for JSON
app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ Lyrics Generation Endpoint
app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY");
    return res.status(500).json({ lyrics: '', error: 'Missing API key' });
  }

  console.log("📥 /generate request received:", req.body);

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
            content: `Write ${bars} of ${mood} style lyrics. Theme: ${prompt}. The rhythm should feel like it's at ${bpm} BPM, but do not mention the BPM number in the lyrics.`
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API Error:", data);
      return res.status(500).json({ lyrics: '', error: data });
    }

    const lyrics = data.choices?.[0]?.message?.content?.trim();

    if (!lyrics) {
      console.error("❌ No lyrics returned:", data);
      return res.status(500).json({ lyrics: '', error: 'No lyrics in response' });
    }

    console.log("✅ Lyrics generated:\n", lyrics);
    res.json({ lyrics });

  } catch (error) {
    console.error('❌ Error talking to OpenAI:', error.message);
    res.status(500).json({ lyrics: '', error: error.message });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

