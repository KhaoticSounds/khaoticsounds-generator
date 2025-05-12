const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 8000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json"
    });

    const imageBase64 = response.data.data[0].b64_json;
    res.json({ imageUrl: `data:image/png;base64,${imageBase64}` });

  } catch (error) {
    console.error("OpenAI image generation error:", error.message);
    res.status(500).json({ error: "Image generation failed." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

