document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");
  const spinner = document.getElementById("loading-spinner");
  const saveBtn = document.getElementById("saveBtn");

  if (!prompt.trim()) {
    output.innerHTML = "Please enter an album cover idea.";
    return;
  }

  output.innerHTML = "";
  spinner.style.display = "block";
  saveBtn.style.display = "none";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!data.imageUrl) throw new Error("No image returned");

    const img = new Image();
    img.src = `/api/image?url=${encodeURIComponent(data.imageUrl)}`;
    img.alt = prompt;
    img.onload = () => {
      spinner.style.display = "none";
      output.innerHTML = "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      output.appendChild(img);
      saveBtn.style.display = "block";
    };

    img.onerror = () => {
      spinner.style.display = "none";
      output.innerHTML = "<span style='color:yellow;'>⚠️ Failed to load the image.</span>";
    };
  } catch (err) {
    spinner.style.display = "none";
    output.innerHTML = "❌ Error generating image.";
  }
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const img = document.querySelector("#output img");
  if (!img) return;
  const link = document.createElement("a");
  link.href = img.src;
  link.download = "album_cover.png";
  link.click();
});

