// ✅ All Required Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

// ✅ Define the Express App
const app = express();
const PORT = process.env.PORT || 3000; // ✅ Use Railway-compatible port

// ✅ Middleware Setup
app.use(cors({
  origin: 'https://www.khaoticsounds.com', // ✅ Allow your live domain
}));
app.use(bodyParser.json());
app.use(express.static('public')); // ✅ Serve frontend files from /public

// ✅ Lyrics Generator Endpoint
app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  // ✅ Confirm API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY in .env");
    return res.status(500).json({ lyrics: '' });
  }

  console.log("📥 /generate endpoint hit. Request body:", req.body);

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
    console.error('❌ AI ERROR:', error.message);
    res.status(500).json({ lyrics: '' });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

