let hasGeneratedOnce = false;
let isPaid = false;

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const promptInput = document.getElementById("promptInput");
const outputBox = document.getElementById("outputBox");
const bpmSlider = document.getElementById("bpmSlider");
const barsSelect = document.getElementById("bars");
const moodSelect = document.getElementById("mood");
const paypalPopup = document.getElementById("paypalPopup");

generateBtn.addEventListener("click", async () => {
  if (hasGeneratedOnce && !isPaid) {
    paypalPopup.classList.remove("hidden");
    return;
  }

  const prompt = promptInput.value.trim();
  const bpm = bpmSlider.value;
  const bars = barsSelect.value;
  const mood = moodSelect.value;

  if (!prompt) {
    outputBox.textContent = "Please enter a prompt.";
    return;
  }

  outputBox.textContent = "Generating lyrics...";

  try {
    const response = await fetch("/generate-lyrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, bpm, bars, mood }),
    });

    const data = await response.json();
    outputBox.textContent = data.lyrics;
    hasGeneratedOnce = true;

    if (isPaid) {
      copyBtn.disabled = false;
    }

  } catch (err) {
    outputBox.textContent = "Something went wrong. Try again.";
    console.error(err);
  }
});

copyBtn.addEventListener("click", () => {
  const text = outputBox.textContent;
  navigator.clipboard.writeText(text);
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = "Copy Lyric";
  }, 1500);
});

