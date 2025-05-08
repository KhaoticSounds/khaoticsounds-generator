async function generateLyrics() {
  const prompt = document.getElementById('prompt').value;
  const res = await fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  document.getElementById('output').textContent = data.output || 'No response.';
}

function copyOutput() {
  const outputText = document.getElementById('output').textContent;
  navigator.clipboard.writeText(outputText).then(() => {
    alert('Lyrics copied to clipboard!');
  });
}
