app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY");
    return res.status(500).json({ lyrics: '', error: 'Missing API key' });
  }

  console.log("📥 /generate request:", req.body);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Write ${bars} bars of ${mood} style lyrics. Theme: ${prompt}. The rhythm should feel like it's at ${bpm} BPM, but do not mention the BPM number in the lyrics.`
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API Error:", data);
      return res.status(500).json({ lyrics: '', error: data });
    }

    const lyrics = data.choices?.[0]?.message?.content?.trim();

    if (!lyrics) {
      console.error("❌ No lyrics returned:", data);
      return res.status(500).json({ lyrics: '', error: 'No lyrics in response' });
    }

    console.log("✅ Generated Lyrics:\n", lyrics);
    res.json({ lyrics });

  } catch (error) {
    console.error('❌ Error talking to OpenAI:', error.message);
    res.status(500).json({ lyrics: '', error: error.message });
  }
});

