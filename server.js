// ✅ server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const https = require("https");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

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
      prompt,
      n: 1,
      size: "512x512",
    });
    res.json({ imageUrl: response.data.data[0].url });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

// ✅ Proxy route to fix CORS image loading issue
app.get("/api/image", (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send("Missing image URL");

  https.get(imageUrl, (response) => {
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.pipe(res);
  }).on("error", () => {
    res.status(500).send("Failed to fetch image");
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



