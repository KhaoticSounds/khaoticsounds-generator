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
    const response = await fetch('https://khaoticsounds-generator-production.up.railway.app/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mood, bars, bpm })
    });

    const data = await response.json();
    if (data.lyrics) {
      output.textContent = data.lyrics;
      generationCount++;
    } else {
      output.textContent = 'No lyrics received. Try again.';
    }
  } catch (error) {
    console.error('Fetch error:', error);
    output.textContent = 'Server error. Please try again later.';
  }
});

document.getElementById('copy').addEventListener('click', () => {
  const text = output.textContent;
  if (!navigator.clipboard) {
    alert('Clipboard not supported. Please copy manually.');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    alert('Lyrics copied to clipboard!');
  }).catch(() => {
    alert('Clipboard permissions blocked. Please copy manually.');
  });
});


