let generationCount = 0;
const output = document.getElementById('output');
const slider = document.getElementById('bpmSlider');
const bpmValue = document.getElementById('bpmValue');

slider.oninput = () => {
  bpmValue.textContent = slider.value;
};

document.getElementById('generate').addEventListener('click', async () => {
  if (generationCount >= 1 && !localStorage.getItem('paidUser')) {
    output.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <h3>🔥 Unlock Unlimited Access</h3>
        <p>You’ve used your free generation. Support us to continue:</p>
        <a href="https://www.paypal.com/ncp/payment/TZRN5VM22UNJU" target="_blank" style="color:#00ffff;">Click here to pay on PayPal</a><br>
        <small>After payment, refresh the page to unlock</small>
      </div>
    `;
    return;
  }

  const prompt = document.getElementById('prompt').value;
  const mood = document.getElementById('mood').value;
  const bars = document.getElementById('bars').value;
  const bpm = slider.value;

  output.textContent = 'Generating...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // Replace this with your actual key
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Write ${bars} bars of lyrics in a ${mood} style at ${bpm} BPM. The theme is: ${prompt}`
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const lyrics = data.choices[0].message.content.trim();
    output.textContent = lyrics;
    generationCount++;
  } catch (err) {
    output.textContent = 'Error generating lyrics. Try again.';
    console.error(err);
  }
});

document.getElementById('copy').addEventListener('click', () => {
  const text = output.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Lyrics copied to clipboard!');
  });
});
