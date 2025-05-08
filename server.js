const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  const { prompt, mood, length } = req.body;

  const fullPrompt = `Write a ${length}-bar ${mood} rap about: ${prompt}`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: fullPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.choices[0].message.content.trim();
    res.json({ lyrics: result });
  } catch (err) {
    console.error("OpenAI API error:", err.response?.data || err.message);
    res.status(500).send("Failed to generate lyrics");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

