// Update BPM display
const slider = document.getElementById('bpmSlider');
const bpmValue = document.getElementById('bpmValue');
slider.oninput = () => {
  bpmValue.textContent = slider.value;
};

// Generate lyrics
document.getElementById('generate').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value;
  const mood = document.getElementById('mood').value;
  const bars = document.getElementById('bars').value;
  const bpm = slider.value;

  const output = document.getElementById('output');
  output.textContent = 'Loading...';

  // Simulated generation (replace this with API call)
  setTimeout(() => {
    output.textContent = `Mood: ${mood}\nBars: ${bars}\nBPM: ${bpm}\nPrompt: ${prompt}\n\nGenerated lyrics...`;
  }, 1000);
});

// Copy to clipboard
document.getElementById('copy').addEventListener('click', () => {
  const text = document.getElementById('output').textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Lyrics copied to clipboard!');
  });
});

