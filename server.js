import express from "express";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import axios from "axios";
import { fileURLToPath } from "url";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

// Express app and OpenAI client
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// === ROUTE: Generate image prompt ===
app.post("/api/cover", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || prompt.length < 3) {
    return res.status(400).json({ error: "Prompt is too short." });
  }

  try {
    console.log("🧠 Generating for prompt:", prompt);
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      n: 1,
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) throw new Error("No image URL received.");

    console.log("✅ Image URL returned:", imageUrl);
    res.json({ imageUrl });

  } catch (error) {
    console.error("❌ Error generating image:", error.message);
    res.status(500).json({ error: "Image generation failed." });
  }
});

// === ROUTE: Proxy image to bypass CORS ===
app.get("/api/image", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send("Missing image URL");

  try {
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", "image/png");
    res.send(imageResponse.data);
  } catch (err) {
    console.error("❌ Image proxy failed:", err.message);
    res.status(500).send("Could not fetch image");
  }
});

// === START SERVER ===
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


