const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  const fullPrompt = `Write ${bars} bars of ${mood.toLowerCase()} rap lyrics at ${bpm} BPM. Theme: ${prompt}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const lyrics = data.choices?.[0]?.message?.content || "No lyrics returned.";
    res.json({ lyrics });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ lyrics: "Error generating lyrics." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
