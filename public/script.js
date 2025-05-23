let generationCount = 0;
const output = document.getElementById('output');
const overlay = document.getElementById('overlay');

document.getElementById('generate').addEventListener('click', async () => {
  if (generationCount >= 1 && !localStorage.getItem('paidUser')) {
    overlay.style.display = 'flex';
    return;
  }

  const prompt = document.getElementById('prompt').value;
  const mood = document.getElementById('mood').value;
  const bars = document.getElementById('bars').value;
  const bpm = document.getElementById('bpmSlider').value;

  output.textContent = 'Generating...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // Replace with your real key
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Write ${bars} bars of lyrics in a ${mood} style. The theme is: ${prompt}. The flow should match a BPM of ${bpm}.`
          }
        ]
      })
    });

    const data = await response.json();
    const lyrics = data.choices[0].message.content.trim();
    output.textContent = lyrics;
    generationCount++;
  } catch (err) {
    output.textContent = 'Error generating lyrics. Try again.';
    console.error(err);
  }
});

document.getElementById('copy').addEventListener('click', () => {
  const text = output.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Lyrics copied to clipboard!');
  });
});
