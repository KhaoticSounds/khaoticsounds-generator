require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const apiKey = process.env.OPENAI_API_KEY;

app.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a rap lyric generator.' },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 250,
        temperature: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ output: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error generating:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate lyrics.' });
  }
});

app.listen(port, () => {
  console.log(`KhaoticSounds Generator running on port ${port}`);
});
