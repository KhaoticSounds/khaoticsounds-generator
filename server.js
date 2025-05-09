const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  const finalPrompt = `Write ${bars} bars of ${mood} rap lyrics at ${bpm} BPM. Theme: ${prompt}`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: finalPrompt,
      max_tokens: 200,
      temperature: 0.8,
    });

    res.json({ lyrics: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Failed to generate lyrics." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
