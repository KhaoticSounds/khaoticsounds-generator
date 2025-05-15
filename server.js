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

app.post("/generate-lyrics", async (req, res) => {
  const { prompt, bpm, bars, mood } = req.body;

  const systemPrompt = `You are a creative rap lyrics generator. Write ${bars || "16"} bars in a ${mood || "flex"} mood at ${bpm} BPM.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const lyrics = data.choices[0]?.message?.content || "No lyrics returned.";

    res.json({ lyrics });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate lyrics." });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


