window.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const outputBox = document.getElementById('output');
  const promptInput = document.getElementById('prompt');
  const moodSelect = document.getElementById('mood');
  const barsSelect = document.getElementById('bars');
  const bpmSlider = document.getElementById('bpm');
  const bpmValue = document.getElementById('bpm-value');

  bpmSlider.addEventListener('input', () => {
    bpmValue.textContent = bpmSlider.value;
  });

  generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    const mood = moodSelect.value;
    const bars = barsSelect.value;
    const bpm = bpmSlider.value;

    outputBox.textContent = 'Loading...';

    try {
      const response = await fetch('https://khaoticsounds-generator-production.up.railway.app/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, mood, bars, bpm })
      });

      const data = await response.json();

      if (data.lyrics) {
        outputBox.textContent = data.lyrics;
      } else {
        outputBox.textContent = 'No lyrics received. Try again.';
        console.error('OpenAI error:', data.error);
      }
    } catch (err) {
      outputBox.textContent = 'Failed to connect. Check console.';
      console.error('Request error:', err);
    }
  });

  copyBtn.addEventListener('click', () => {
    const lyrics = outputBox.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(lyrics).catch(err => {
        console.error('Clipboard error:', err);
      });
    } else {
      alert('Clipboard not supported.');
    }
  });
});
