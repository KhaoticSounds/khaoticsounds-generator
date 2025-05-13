let loadHelp = false;
let generationCount = 0;
let isOwner = true; // set to false for public use
let paidUser = false;

const generateBtn = document.getElementById("generate-btn");
const loadBtn = document.getElementById("load-btn");
const saveBtn = document.getElementById("save-btn");
const popup = document.getElementById("popup");
const promptInput = document.getElementById("prompt-input");
const loader = document.getElementById("loader");
const outputImg = document.getElementById("generated-image");
const placeholder = document.getElementById("placeholder-text");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.querySelector("#progress-bar .bar");
const imageUpload = document.getElementById("image-upload");
const payConfirm = document.getElementById("confirm-pay");

let uploadedImage = null;

loadBtn.addEventListener("click", () => {
  loadHelp = !loadHelp;
  loadBtn.textContent = loadHelp ? "Load: On" : "Load";
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
  if (!isOwner && generationCount >= 1 && !paidUser) {
    popup.classList.remove("hidden");
    return;
  }

  const prompt = promptInput.value.trim();
  if (!prompt) return;

  loader.classList.remove("hidden");
  progressBar.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressFill.style.animation = "load 3s linear forwards";

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
        loadHelp,
        image: uploadedImage
      })
    });

    const data = await response.json();
    outputImg.src = data.image;
    outputImg.style.display = "block";

    loader.classList.add("hidden");
    progressBar.classList.add("hidden");

    if (isOwner || paidUser) {
      saveBtn.classList.remove("hidden");
    }

    generationCount++;
  } catch (err) {
    loader.classList.add("hidden");
    progressBar.classList.add("hidden");
    placeholder.textContent = "Something went wrong. Try again.";
    placeholder.style.display = "block";
  }
});

payConfirm.addEventListener("click", () => {
  paidUser = true;
  popup.classList.add("hidden");
  saveBtn.classList.remove("hidden");
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = outputImg.src;
  link.download = "album-cover.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

