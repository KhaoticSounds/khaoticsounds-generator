require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/generate-image", async (req, res) => {
  const { prompt, advisor, image } = req.body;

  try {
    const fullPrompt = advisor
      ? `Album cover idea: ${prompt}. Add depth and visual creativity.`
      : prompt;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    if (!data || !data.data || !data.data[0] || !data.data[0].url) {
      return res.status(500).json({ error: "No image returned by OpenAI." });
    }

    const imageUrl = data.data[0].url;
    res.json({ image: imageUrl });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


