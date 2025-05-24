generateBtn.addEventListener('click', async () => {
  const isPaid = localStorage.getItem('userPaid') === 'true';

  if (!isPaid && isLocked) return;

  // If unpaid and already used once
  if (!isPaid && hasGenerated) {
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

  document.getElementById('mood').value = 'None';
});



