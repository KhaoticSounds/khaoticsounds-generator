const generateBtn = document.getElementById("generate-btn");
const promptInput = document.getElementById("prompt");
const imageOutput = document.getElementById("image-output");
const spinner = document.getElementById("spinner");
const saveBtn = document.getElementById("save-btn");

generateBtn.onclick = async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  spinner.style.display = "block";
  imageOutput.innerHTML = "";
  imageOutput.appendChild(spinner);
  saveBtn.style.display = "none";

  try {
    const response = await fetch("/api/cover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (!data.imageUrl) throw new Error("No image URL returned.");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `/api/image?url=${encodeURIComponent(data.imageUrl)}`;

    img.onload = () => {
      spinner.style.display = "none";
      imageOutput.innerHTML = "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      imageOutput.appendChild(img);
      saveBtn.style.display = "block";
    };

    img.onerror = () => {
      spinner.style.display = "none";
      imageOutput.innerHTML = "<span class='placeholder-text'>⚠️ Failed to load the image.</span>";
    };
  } catch (err) {
    console.error("Error generating image:", err);
    spinner.style.display = "none";
    imageOutput.innerHTML = "<span class='placeholder-text'>⚠️ Something went wrong. Try again later.</span>";
  }
};

saveBtn.onclick = () => {
  const img = imageOutput.querySelector("img");
  if (!img) return;

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");

  const tempImg = new Image();
  tempImg.crossOrigin = "anonymous";
  tempImg.src = img.src;

  tempImg.onload = () => {
    ctx.drawImage(tempImg, 0, 0);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "album-cover.png";
    link.click();
  };

  tempImg.onerror = () => {
    alert("Download failed.");
  };
};
