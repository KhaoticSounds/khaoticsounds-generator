const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API route
app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  // Temporary mock response (replace this with OpenAI API call)
  const mockLyrics = `
Here’s your verse on "${prompt}":

Yeah, I’m steppin' in the light, tryna make a change,  
Khaotic on the beat, feelin’ out the range.  
Tales from the block to the stars we claim,  
Turnin' pain into power, remember the name.
`;

  res.json({ output: mockLyrics });
});

// Serve the HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
