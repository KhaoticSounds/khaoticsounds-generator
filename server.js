const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080; // fallback for local dev

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({
  origin: ['https://www.khaoticsounds.com', 'http://localhost:3000']
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


