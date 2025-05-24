window.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const outputBox = document.getElementById('output');
  const promptInput = document.getElementById('prompt');
  const moodSelect = document.getElementById('mood');
  const barsSelect = document.getElementById('bars');
  const bpmSlider = document.getElementById('bpm');
  const overlay = document.getElementById('paywall-overlay');
  const countdownDisplay = document.getElementById('countdown');

  let hasGenerated = false;
  let isLocked = false;

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

    const prompt = promptInput.value;
    const mood = moodSelect.value;
    const bars = barsSelect.value;
    const bpm = bpmSlider.value;

    outputBox.textContent = 'Generating...';

    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mood, bars, bpm })
      });

      const data = await res.json();
      outputBox.textContent = data.lyrics || 'Something went wrong.';
      hasGenerated = true;
    } catch (err) {
      outputBox.textContent = 'Error generating lyrics.';
    }
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputBox.textContent);
  });
});



