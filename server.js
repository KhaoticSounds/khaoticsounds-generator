const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Route: Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Lyrics Generator
app.post('/api/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  if (!prompt || !mood || !bars || !bpm) {
    return res.status(400).json({ error: 'Missing input fields.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate a ${bars}-bar rap verse about "${prompt}" in a "${mood}" mood, matching a BPM of ${bpm}.`,
        },
      ],
      temperature: 0.8,
    });

    res.json({ lyrics: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error generating lyrics:', error.message);
    res.status(500).json({ error: 'Failed to generate lyrics.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
