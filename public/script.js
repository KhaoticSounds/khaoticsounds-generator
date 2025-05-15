window.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const outputBox = document.getElementById('output');
  const bpmSlider = document.getElementById('bpm');
  const bpmValue = document.getElementById('bpm-value');
  const ctaPopup = document.getElementById('cta-popup');

  const isOwner = true;
  let isPaidUser = false;

  const COOLDOWN_MINUTES = 30;

  function getCooldownEnd() {
    return localStorage.getItem('cooldownEnd');
  }

  function isInCooldown() {
    const end = getCooldownEnd();
    if (!end) return false;
    return new Date().getTime() < parseInt(end);
  }

  function startCooldown() {
    const cooldownEnd = new Date().getTime() + COOLDOWN_MINUTES * 60 * 1000;
    localStorage.setItem('cooldownEnd', cooldownEnd);
  }

  function lockGenerator() {
    ctaPopup.classList.remove('hidden');
    copyBtn.disabled = true;
    generateBtn.disabled = true;
  }

  function unlockGenerator() {
    ctaPopup.classList.add('hidden');
    copyBtn.disabled = false;
    generateBtn.disabled = false;
  }

  bpmSlider.addEventListener('input', () => {
    bpmValue.textContent = bpmSlider.value;
  });

  generateBtn.addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const mood = document.getElementById('mood').value;
    const bars = document.getElementById('bars').value;
    const bpm = bpmSlider.value;

    if (!isOwner && !isPaidUser && isInCooldown()) {
      lockGenerator();
      return;
    }

    const input = `Mood: ${mood}, Bars: ${bars}, Prompt: ${prompt}. Use a tempo that feels like ${bpm} BPM but do not mention BPM in the lyrics.`;
    outputBox.textContent = 'Loading...';

    try {
      const response = await fetch('/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      const data = await response.json();
      outputBox.textContent = data.lyrics || 'Error: No lyrics generated';

      bpmSlider.value = 120;
      bpmValue.textContent = 120;

      if (!isOwner && !isPaidUser) {
        startCooldown();
        lockGenerator();
      } else {
        copyBtn.disabled = false;
      }

    } catch (error) {
      outputBox.textContent = 'An error occurred while generating.';
      console.error('Fetch error:', error);
    }
  });

  copyBtn.addEventListener('click', () => {
    if (copyBtn.disabled) return;
    navigator.clipboard.writeText(outputBox.textContent);
  });

  if (!isOwner && !isPaidUser && isInCooldown()) {
    lockGenerator();
  } else if (!isPaidUser) {
    unlockGenerator();
  }
});
