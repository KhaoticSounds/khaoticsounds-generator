require('dotenv').config();

const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Setup OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API route to generate lyrics
app.post('/api/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  const fullPrompt = `Generate ${bars} bars of ${mood} rap lyrics at ${bpm} BPM based on: ${prompt}`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: fullPrompt }],
    });

    const lyrics = completion.data.choices[0].message.content;
    res.json({ lyrics });
  } catch (error) {
    console.error('Error generating lyrics:', error.message);
    res.status(500).json({ error: 'Failed to generate lyrics' });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
