<script>
  window.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const outputBox = document.getElementById('output');
    const promptInput = document.getElementById('prompt');
    const moodSelect = document.getElementById('mood');
    const barsSelect = document.getElementById('bars');
    const bpmSlider = document.getElementById('bpm');
    const bpmValue = document.getElementById('bpm-value');
    const overlay = document.getElementById('paywall-overlay');
    const closeBtn = document.getElementById('close-overlay');
    const countdownDisplay = document.getElementById('countdown');

    let hasGenerated = false;
    let isLocked = false;

    bpmSlider.addEventListener('input', () => {
      bpmValue.textContent = bpmSlider.value;
    });

    generateBtn.addEventListener('click', async () => {
      if (isLocked) return;

      if (hasGenerated) {
        overlay.style.display = 'flex';
        isLocked = true;

        let countdown = 120;
        countdownDisplay.textContent = `Try again in ${countdown} seconds...`;

        const interval = setInterval(() => {
          countdown--;
          countdownDisplay.textContent = `Try again in ${countdown} seconds...`;
          if (countdown <= 0) {
            clearInterval(interval);
            overlay.style.display = 'none';
            isLocked = false;
            hasGenerated = false;
          }
        }, 1000);

        return;
      }

      const prompt = promptInput.value.trim();
      const mood = moodSelect.value;
      const bars = barsSelect.value;
      const bpm = bpmSlider.value;

      outputBox.textContent = 'Loading...';

      try {
        const response = await fetch('https://khaoticsounds-generator-production.up.railway.app/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, mood, bars, bpm })
        });

        const data = await response.json();

        if (data.lyrics) {
          outputBox.textContent = data.lyrics;
          hasGenerated = true;
        } else {
          outputBox.textContent = 'No lyrics received. Try again.';
          console.error('AI error:', data.error);
        }
      } catch (err) {
        outputBox.textContent = 'Error connecting. Try again.';
        console.error(err);
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

    closeBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  });
</script>


