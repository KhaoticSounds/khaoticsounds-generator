const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('prompt');
const output = document.getElementById('output');
const bpmSlider = document.getElementById('bpmSlider');
const bpmDisplay = document.getElementById('bpmDisplay');
const moodSelect = document.getElementById('mood');
const barsSelect = document.getElementById('bars');
const spinner = document.getElementById('spinner');
const copyBtn = document.getElementById('copyBtn');

bpmSlider.addEventListener('input', () => {
  bpmDisplay.textContent = `BPM: ${bpmSlider.value}`;
});

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  const mood = moodSelect.value;
  const bars = barsSelect.value;
  const bpm = bpmSlider.value;

  if (!prompt) return;

  spinner.style.display = 'block';
  output.textContent = '';

  try {
    const response = await fetch('/generate-lyrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Mood: ${mood || "None"}, Bars: ${bars || "None"}, BPM: ${bpm}. Topic: ${prompt}`,
      }),
    });

    const data = await response.json();
    output.textContent = data.lyrics || 'No lyrics generated.';
  } catch (err) {
    output.textContent = 'Error generating lyrics.';
  } finally {
    spinner.style.display = 'none';
  }
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(output.textContent);
});

