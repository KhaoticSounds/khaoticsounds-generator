window.addEventListener('DOMContentLoaded', () => {
  const bpmSlider = document.getElementById('bpm');
  const bpmValue = document.getElementById('bpm-value');
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const outputBox = document.getElementById('output');
  const overlay = document.getElementById('paywall-overlay');
  const countdownDisplay = document.getElementById('countdown');

  let hasGenerated = false;
  let isLocked = false;

  bpmSlider.addEventListener('input', () => {
    bpmValue.innerText = bpmSlider.value;
  });

  generateBtn.addEventListener('click', async () => {
    if (isLocked) return;

    if (hasGenerated) {
      overlay.style.display = 'flex';
      isLocked = true;

      let seconds = 60;
      countdownDisplay.textContent = `Try again in ${seconds} seconds`;

      const interval = setInterval(() => {
        seconds--;
        countdownDisplay.textContent = `Try again in ${seconds} seconds`;
        if (seconds <= 0) {
          clearInterval(interval);
          overlay.style.display = 'none';
          isLocked = false;
          hasGenerated = false;
        }
      }, 1000);

      return;
    }

    const prompt = document.getElementById('prompt').value;
    const mood = document.getElementById('mood').value;
    const bars = document.getElementById('bars').value;
    const bpm = bpmSlider.value;

    outputBox.value = 'Loading...';

    try {
      const response = await fetch('https://khaoticsounds-generator-production.up.railway.app/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mood, bars, bpm })
      });

      const data = await response.json();
      outputBox.value = data.lyrics || 'No lyrics returned.';
      hasGenerated = true;
    } catch (err) {
      outputBox.value = 'Failed to generate lyrics.';
    }

    // Optional: reset mood to None
    document.getElementById('mood').value = 'None';
  });

  copyBtn.addEventListener('click', () => {
    outputBox.select();
    document.execCommand('copy');
  });
});


