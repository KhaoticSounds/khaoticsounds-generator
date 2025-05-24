window.addEventListener('DOMContentLoaded', () => {
  const bpmSlider = document.getElementById('bpm');
  const bpmValue = document.getElementById('bpm-value');
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const outputBox = document.getElementById('output');

  // Update BPM display
  bpmSlider.addEventListener('input', () => {
    bpmValue.innerText = bpmSlider.value;
  });

  // Generate Lyrics
  generateBtn.addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const mood = document.getElementById('mood').value;
    const bars = document.getElementById('bars').value;
    const bpm = bpmSlider.value;

    outputBox.textContent = 'Loading...';

    try {
      const response = await fetch('https://khaoticsounds-generator-production.up.railway.app/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mood, bars, bpm })
      });

      const data = await response.json();
      outputBox.textContent = data.lyrics || 'No lyrics returned.';
    } catch (err) {
      outputBox.textContent = 'Failed to generate lyrics.';
    }

    // Reset dropdown
    document.getElementById('mood').value = 'None';
  });

  // Copy to clipboard
  copyBtn.addEventListener('click', () => {
    const range = document.createRange();
    range.selectNode(outputBox);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
  });
});




