let usageCount = 0;
let isPaidUser = false;

document.getElementById('generate-btn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value.trim();
  const image = document.getElementById('cover-image');
  const spinner = document.getElementById('spinner');
  const saveBtn = document.getElementById('save-btn');
  const popup = document.getElementById('popup-paywall');

  if (!prompt) return;

  if (usageCount >= 1 && !isPaidUser) {
    popup.style.display = 'flex';
    return;
  }

  image.style.display = 'none';
  spinner.style.display = 'block';
  saveBtn.style.display = 'none';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.imageUrl) {
      image.src = data.imageUrl;
      image.style.opacity = 1;
      image.style.display = 'block';
      if (isPaidUser) {
        saveBtn.style.display = 'inline-block';
      }
      usageCount++;
    } else {
      image.alt = 'No image returned.';
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    spinner.style.display = 'none';
  }
});

document.getElementById('save-btn').addEventListener('click', () => {
  const img = document.getElementById('cover-image');
  if (img.src) {
    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'album-cover.png';
    link.click();
  }
});

window.addEventListener('message', (event) => {
  if (event.data === 'unlock_paid') {
    isPaidUser = true;
    document.getElementById('save-btn').style.display = 'inline-block';
    document.getElementById('popup-paywall').style.display = 'none';
  }
});

