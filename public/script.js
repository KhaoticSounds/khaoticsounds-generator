window.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const outputBox = document.getElementById('output');
  const bpmSlider = document.getElementById('bpm');
  const bpmValue = document.getElementById('bpm-value');
  const ctaPopup = document.getElementById('cta-popup');

  const isOwner = true; // <- Set to true only for you
  let isPaidUser = false; // <- Change this to true after user pays

  bpmSlider.addEventListener('input', () => {
    bpmValue.textContent = bpmSlider.value;
  });

  generateBtn.addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const mood = document.getElementById('mood').value;
    const bars = document.getElementById('bars').value;
    const bpm = bpmSlider.value;

    const input = `Mood: ${mood}, Bars: ${bars}, BPM: ${bpm}, Prompt: ${prompt}`;
    outputBox.textContent = 'Loading...';

    try {
      const response = await fetch('/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      const data = await response.json();
      outputBox.textContent = data.lyrics || 'Error: No lyrics generated';

      // Count and limit free users only
      if (!isOwner && !isPaidUser) {
        if (++window.generationCount > 1) {
          ctaPopup.classList.remove('hidden');
          copyBtn.disabled = true;
          generateBtn.disabled = true;
        } else {
          copyBtn.disabled = false;
        }
      }
    } catch (error) {
      outputBox.textContent = 'An error occurred';
      console.error('Fetch error:', error);
    }
  });

  copyBtn.addEventListener('click', () => {
    if (copyBtn.disabled) return;
    navigator.clipboard.writeText(outputBox.textContent);
  });

  window.generationCount = 0;
});

