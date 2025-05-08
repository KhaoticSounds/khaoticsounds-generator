require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai"); // ✅ Fix: import OpenAI

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-lyrics", async (req, res) => {
  const { mood, topic, type } = req.body;

  const prompt = `Write a ${type === "hook" ? "8-bar hook" : "16-bar verse"} in a ${mood} mood about ${topic}, rap style.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({ Lyrics: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
