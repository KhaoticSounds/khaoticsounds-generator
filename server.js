// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/generate-image", async (req, res) => {
  const { prompt, loadHelp, image } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: loadHelp && image ? `${prompt}. Include reference influence.` : prompt,
        size: "1024x1024",
        response_format: "url"
      })
    });

    const data = await response.json();
    const imageUrl = data.data[0].url;
    res.json({ image: imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Image generation failed." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
