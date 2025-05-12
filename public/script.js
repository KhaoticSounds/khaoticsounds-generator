document.getElementById('generate-btn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value.trim();
  const image = document.getElementById('cover-image');
  const spinner = document.getElementById('spinner');
  const saveBtn = document.getElementById('save-btn');

  if (!prompt) return;

  image.style.display = 'none';
  spinner.style.display = 'block';
  saveBtn.style.display = 'none';

  try {
    const response = await fetch('https://khaoticsounds-generator-production-775c.up.railway.app/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.imageUrl) {
      image.src = data.imageUrl;
      image.style.display = 'block';
      saveBtn.style.display = 'inline-block';
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

