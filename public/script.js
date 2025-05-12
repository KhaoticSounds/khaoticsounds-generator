let bpmSlider = document.getElementById("bpm-slider");
let bpmLabel = document.getElementById("bpm-label");
let generateBtn = document.getElementById("generate");
let promptInput = document.getElementById("prompt");
let moodSelect = document.getElementById("mood");
let barsSelect = document.getElementById("bars");
let lyricsOutput = document.getElementById("lyrics-output");
let copyBtn = document.getElementById("copy-btn");
let popup = document.getElementById("subscription-popup");
let spinner = document.getElementById("loading-spinner");
let freeUsage = true;

// Update BPM label live
bpmSlider.addEventListener("input", () => {
  bpmLabel.textContent = "BPM: " + bpmSlider.value;
});

// Handle lyric generation
generateBtn.addEventListener("click", async () => {
  if (!freeUsage) {
    popup.style.display = "flex";
    return;
  }

  const prompt = promptInput.value.trim();
  const mood = moodSelect.value;
  const bars = barsSelect.value;
  const bpm = bpmSlider.value;

  if (!prompt) return;

  spinner.style.display = "block";
  generateBtn.disabled = true;
  lyricsOutput.textContent = "";

  try {
    const fullPrompt = `Generate ${bars} bars of ${mood} rap lyrics at ${bpm} BPM about: ${prompt}`;
    
    const response = await fetch("https://khaoticsounds-generator-production-775c.up.railway.app/generate-lyrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: fullPrompt })
    });

    const data = await response.text();
    lyricsOutput.textContent = data;
    promptInput.style.display = "none";
    copyBtn.style.display = "block";
    freeUsage = false;

    // Reset free generation after 1 hour
    setTimeout(() => {
      freeUsage = true;
    }, 3600000); // 1 hour

  } catch (e) {
    lyricsOutput.textContent = "Error generating lyrics. Please try again.";
  } finally {
    spinner.style.display = "none";
    generateBtn.disabled = false;
  }
});

// Handle copy button
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(lyricsOutput.textContent);
});

