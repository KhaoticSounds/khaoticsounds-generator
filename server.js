app.post('/generate', async (req, res) => {
  const { prompt, mood, bars, bpm } = req.body;

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
            content: `Write ${bars} bars of lyrics in a ${mood} style. Theme: ${prompt}. Match a BPM of ${bpm}.`
          }
        ]
      })
    });

    const data = await response.json();
    const lyrics = data.choices?.[0]?.message?.content?.trim() || '';
    res.json({ lyrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ lyrics: '' });
  }
});
