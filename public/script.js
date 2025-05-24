<script>
  window.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const outputBox = document.getElementById('output');
    const bpmSlider = document.getElementById('bpm');
    const bpmValue = document.getElementById('bpm-value');
    const overlay = document.getElementById('overlay');
    const countdownDisplay = document.getElementById('countdown');

    let hasGenerated = false;

    bpmSlider.addEventListener('input', () => {
      bpmValue.innerText = bpmSlider.value;
    });

    generateBtn.addEventListener('click', async () => {
      if (hasGenerated) {
        overlay.style.display = 'flex';
        let countdown = 120;

        countdownDisplay.innerText = `Try again in ${countdown} seconds...`;

        const interval = setInterval(() => {
          countdown--;
          countdownDisplay.innerText = `Try again in ${countdown} seconds...`;
          if (countdown <= 0) {
            clearInterval(interval);
            overlay.style.display = 'none';
            hasGenerated = false;
          }
        }, 1000);

        return;
      }

      hasGenerated = true;

      const prompt = document.getElementById('prompt').value;
      const mood = document.getElementById('mood').value;
      const bars = document.getElementById('bars').value;
      const bpm = bpmSlider.value;

      outputBox.value = 'Loading...';

      try {
        const response = await fetch('/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, mood, bars, bpm })
        });

        const data = await response.json();
        outputBox.value = data.lyrics || 'No lyrics returned.';
      } catch (err) {
        outputBox.value = 'Failed to generate lyrics.';
      }
    });

    copyBtn.addEventListener('click', () => {
      outputBox.select();
      document.execCommand('copy');
    });
  });
</script>


