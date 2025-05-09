const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
          content: `Write ${bars} bars of lyrics about "${prompt}" in a "${mood}" mood at ${bpm} BPM.`,
        },
      ],
    });

    res.json({ lyrics: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: 'Failed to generate lyrics.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
