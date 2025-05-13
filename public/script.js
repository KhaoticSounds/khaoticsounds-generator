let advisorOn = false;
let generationCount = 0;
let isOwner = true; // Change to false for general users

const generateBtn = document.getElementById("generate-btn");
const advisorToggle = document.getElementById("advisor-toggle");
const saveBtn = document.getElementById("save-btn");
const popup = document.getElementById("popup");
const promptInput = document.getElementById("prompt-input");
const loader = document.getElementById("loader");
const outputImg = document.getElementById("generated-image");
const placeholder = document.getElementById("placeholder-text");
const imageUpload = document.getElementById("image-upload");

let uploadedImage = null;

advisorToggle.addEventListener("click", () => {
  advisorOn = !advisorOn;
  advisorToggle.textContent = `Advisor: ${advisorOn ? "On" : "Off"}`;
});

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      uploadedImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

generateBtn.addEventListener("click", async () => {
  if (!isOwner && generationCount >= 1) {
    popup.classList.remove("hidden");
    return;
  }

  const prompt = promptInput.value.trim();
  if (!prompt) return;

  loader.classList.remove("hidden");
  outputImg.style.display = "none";
  placeholder.style.display = "none";

  try {
    const response = await fetch("/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        advisor: advisorOn,
        image: uploadedImage
      })
    });

    const data = await response.json();
    outputImg.src = data.image;
    outputImg.style.display = "block";

    loader.classList.add("hidden");

    if (isOwner) {
      saveBtn.classList.remove("hidden");
    }

    generationCount++;
  } catch (err) {
    loader.classList.add("hidden");
    placeholder.textContent = "Something went wrong. Try again.";
    placeholder.style.display = "block";
  }
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = outputImg.src;
  link.download = "album-cover.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

