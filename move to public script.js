// Update BPM display as the slider changes
document.getElementById("bpm").addEventListener("input", function () {
  document.getElementById("bpm-display").textContent = this.value;
});

// Handle Generate Lyrics button
async function generateLyrics() {
  const prompt = document.getElementById("prompt").value;
  const mood = document.getElementById("mood").value;
  const bars = document.getElementById("bars").value;
  const bpm = document.getElementById("bpm").value;

  const outputBox = document.getElementById("output");
  outputBox.textContent = "Generating lyrics...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, mood, bars, bpm }),
    });

    const data = await response.json();
    outputBox.textContent = data.lyrics || "No lyrics returned.";
  } catch (error) {
    outputBox.textContent = "Error generating lyrics.";
    console.error(error);
  }
}

// Handle Copy Lyrics button
function copyLyrics() {
  const output = document.getElementById("output");
  navigator.clipboard.writeText(output.textContent);
}
