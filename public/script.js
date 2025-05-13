let advisorOn = false;
let generationCount = 0;
const isOwner = true; // Set to false for regular users

document.getElementById("advisor-btn").addEventListener("click", () => {
  advisorOn = !advisorOn;
  document.getElementById("advisor-btn").innerText = `Advisor: ${advisorOn ? "On" : "Off"}`;
});

document.getElementById("generate-btn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt-input").value.trim();
  const fileInput = document.getElementById("image-upload");
  const file = fileInput.files[0];

  if (!prompt) return alert("Please enter a description.");

  if (!isOwner && generationCount >= 1) {
    document.getElementById("subscription-popup").style.display = "flex";
    return;
  }

  document.getElementById("loading-spinner").style.display = "block";
  document.getElementById("placeholder-text").style.display = "none";
  document.getElementById("generated-image").style.display = "none";

  const formData = new FormData();
  formData.append("prompt", prompt);
  if (file) formData.append("image", file);

  const res = await fetch("/generate-image", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  const imageUrl = data?.image_url;

  if (imageUrl) {
    const img = document.getElementById("generated-image");
    img.src = imageUrl;
    img.style.display = "block";
  }

  document.getElementById("loading-spinner").style.display = "none";
  generationCount++;
  if (isOwner) document.getElementById("save-btn").style.display = "block";
});

document.getElementById("save-btn").addEventListener("click", () => {
  const image = document.getElementById("generated-image");
  if (!image.src) return;

  const link = document.createElement("a");
  link.href = image.src;
  link.download = "album_cover.png";
  link.click();
});

