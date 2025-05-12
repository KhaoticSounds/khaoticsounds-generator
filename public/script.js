async function generateCover() {
  const prompt = document.getElementById("prompt").value.trim();
  const image = document.getElementById("cover-output");
  const spinner = document.getElementById("loading-spinner");
  const saveBtn = document.getElementById("save-btn");

  image.src = "";
  image.alt = "Generating...";
  spinner.style.display = "block";
  saveBtn.style.display = "none";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data && data.imageUrl) {
      image.src = data.imageUrl;
      image.onload = () => {
        spinner.style.display = "none";
        saveBtn.style.display = "inline-block";
      };
    } else {
      throw new Error("No image URL received.");
    }
  } catch (err) {
    console.error(err);
    spinner.style.display = "none";
    image.alt = "Failed to load the image.";
  }
}

function saveImage() {
  const img = document.getElementById("cover-output");
  if (!img.src) return;

  const link = document.createElement("a");
  link.href = img.src;
  link.download = "album_cover.png";
  link.click();
}


