const generateBtn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const promptInput = document.getElementById("prompt");
const image = document.getElementById("generated-image");
const spinner = document.getElementById("loading-spinner");

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  image.src = "";
  spinner.classList.remove("hidden");
  saveBtn.classList.add("hidden");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    if (data.imageUrl) {
      image.src = data.imageUrl;
      saveBtn.classList.remove("hidden");
    } else {
      image.alt = "Failed to generate image.";
    }
  } catch (err) {
    image.alt = "Error loading image.";
  } finally {
    spinner.classList.add("hidden");
  }
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = image.src;
  link.download = "album_cover.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

