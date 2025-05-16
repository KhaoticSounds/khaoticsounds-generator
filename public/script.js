let generationCount = 0;
let paid = false;

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('output');
  const prompt = document.getElementById('prompt');
  const mood = document.getElementById('mood');
  const bars = document.getElementById('bars');
  const bpm = document.getElementById('bpm');
  const bpmValue = document.getElementById('bpm-value');
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const ctaPopup = document.getElementById('cta-popup');

  bpm.addEventListener('input', () => {
    bpmValue.textContent = `BPM: ${bpm.value}`;
  });

  generateBtn.addEventListener('click', async () => {
    if (!paid && generationCount >= 1) {
      ctaPopup.classList.remove('hidden');
      return;
    }

    const input = `Mood: ${mood.value}, Bars: ${bars.value}, BPM: ${bpm.value}, Prompt: ${prompt.value}`;
    output.textContent = "Loading...";

    try {
      const res = await fetch('/generate-lyrics', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ input })
      });

      const data = await res.json();
      output.textContent = data.lyrics || "No response.";
      generationCount++;

      if (paid) {
        copyBtn.disabled = false;
      }
      prompt.value = '';
      bpm.value = 120;
      bpmValue.textContent = 'BPM: 120';
    } catch (err) {
      output.textContent = "Error generating lyrics.";
    }
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.textContent);
  });
});

