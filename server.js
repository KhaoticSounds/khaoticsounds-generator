const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 8080;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

