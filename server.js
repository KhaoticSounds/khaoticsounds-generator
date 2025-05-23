app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY in .env");
    return res.status(500).json({ lyrics: '' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Write ${bars} bars of lyrics in a ${mood} style. Theme: ${prompt}. Match a BPM of ${bpm}.`
        }],
        temperature: 0.8
      })
    });

    const data = await response.json();
    console.log('✅ OpenAI Response:', data);

    const lyrics = data.choices?.[0]?.message?.content?.trim();
    if (!lyrics) throw new Error('No lyrics returned');

    res.json({ lyrics });
  } catch (err) {
    console.error('❌ OpenAI ERROR:', err);
    res.status(500).json({ lyrics: '' });
  }
});

