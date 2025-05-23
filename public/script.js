let generationCount = 0;
const output = document.getElementById('output');
const overlay = document.getElementById('overlay');

document.getElementById('generate').addEventListener('click', async () => {
  if (generationCount >= 1 && !localStorage.getItem('paidUser')) {
    overlay.style.display = 'flex';
    return;
  }

  const prompt = document.getElementById('prompt').value.trim();
  const mood = document.getElementById('mood').value;
  const bars = document.getElementById('bars').value;
  const bpm = document.getElementById('bpmSlider').value;

  if (!prompt || mood === 'none' || bars === 'none') {
    output.textContent = 'Please enter a prompt and select a mood and bar count.';
    return;
  }

  output.textContent = 'Generating...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // Replace with your key
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Write ${bars} bars of lyrics in a ${mood} style. Theme: ${prompt}. Match a BPM of ${bpm}.`
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      const lyrics = data.choices[0].message.content.trim();
      output.textContent = lyrics;
      generationCount++;
    } else {
      output.textContent = 'No response from AI. Please try again.';
    }
  } catch (err) {
    output.textContent = 'Error generating lyrics. Check your API key and try again.';
    console.error(err);
  }
});

document.getElementById('copy').addEventListener('click', () => {
  const text = output.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Lyrics copied to clipboard!');
  });
});

