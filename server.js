const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai'); // ✅ Correct import for v4+
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;
  if (!prompt || !mood || !bars || !bpm) {
    return res.status(400).json({ error: 'Missing input fields.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Write ${bars} bars of lyrics about "${prompt}" in a "${mood}" mood at ${bpm} BPM.`,
        },
      ],
      temperature: 0.8,
    });

    res.json({ lyrics: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: 'Failed to generate lyrics.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
