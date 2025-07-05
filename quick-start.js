const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock data
const mockMovies = [
  {
    title: "The Shawshank Redemption",
    year: "1994",
    reason: "A powerful story of hope and friendship that will lift your spirits.",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    youtubeId: "6hB3S9bIaco"
  },
  {
    title: "La La Land",
    year: "2016",
    reason: "A beautiful musical that captures the magic of dreams and romance.",
    description: "A jazz pianist falls for an aspiring actress in Los Angeles.",
    youtubeId: "0pdqf4P9MB8"
  },
  {
    title: "The Dark Knight",
    year: "2008",
    reason: "An intense psychological thriller that will keep you on the edge of your seat.",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    youtubeId: "EXeTwQWrcwY"
  },
  {
    title: "Spirited Away",
    year: "2001",
    reason: "A magical animated adventure that will transport you to another world.",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    youtubeId: "ByXuk9QqQkk"
  },
  {
    title: "The Grand Budapest Hotel",
    year: "2014",
    reason: "A whimsical comedy that will brighten your day with its quirky charm.",
    description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
    youtubeId: "eN2Zc2Y3MPk"
  }
];

const mockMoods = [
  "Happy", "Sad", "Angry", "Excited", "Romantic", 
  "Scared", "Neutral", "Anxious", "Peaceful", "Confused"
];

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  // In mock mode, we'll accept any request
  req.user = { uid: 'mock-user-123' };
  next();
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Mock mood analysis
app.post('/api/analyze-mood', mockAuth, (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Simple keyword-based mood detection
  const textLower = text.toLowerCase();
  let detectedMoods = [];

  if (textLower.includes('happy') || textLower.includes('joy') || textLower.includes('excited')) {
    detectedMoods.push('Happy', 'Excited');
  } else if (textLower.includes('sad') || textLower.includes('depressed') || textLower.includes('down')) {
    detectedMoods.push('Sad', 'Neutral');
  } else if (textLower.includes('angry') || textLower.includes('mad') || textLower.includes('furious')) {
    detectedMoods.push('Angry', 'Anxious');
  } else if (textLower.includes('love') || textLower.includes('romantic') || textLower.includes('heart')) {
    detectedMoods.push('Romantic', 'Happy');
  } else if (textLower.includes('scared') || textLower.includes('afraid') || textLower.includes('fear')) {
    detectedMoods.push('Scared', 'Anxious');
  } else if (textLower.includes('peaceful') || textLower.includes('calm') || textLower.includes('relaxed')) {
    detectedMoods.push('Peaceful', 'Neutral');
  } else if (textLower.includes('confused') || textLower.includes('unsure') || textLower.includes('doubt')) {
    detectedMoods.push('Confused', 'Neutral');
  } else {
    // Default moods
    detectedMoods = ['Neutral', 'Peaceful'];
  }

  // Add a random mood for variety
  const randomMood = mockMoods[Math.floor(Math.random() * mockMoods.length)];
  if (!detectedMoods.includes(randomMood)) {
    detectedMoods.push(randomMood);
  }

  res.json({ moods: detectedMoods.slice(0, 3) });
});

// Mock movie recommendation
app.post('/api/recommend-movie', mockAuth, (req, res) => {
  const { text, moods } = req.body;
  
  if (!text || !moods) {
    return res.status(400).json({ error: 'Text and moods are required' });
  }

  const isSurprise = text.toLowerCase().includes("surprise me") || text.toLowerCase().includes("can't decide");
  
  // Select a random movie
  const randomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
  
  // Create a personalized reason based on mood
  const primaryMood = moods[0];
  let reason = randomMovie.reason;
  
  if (isSurprise) {
    reason = `This is a delightful surprise! ${randomMovie.reason}`;
  } else {
    reason = `Perfect for your ${primaryMood.toLowerCase()} mood! ${randomMovie.reason}`;
  }

  const movieData = {
    ...randomMovie,
    reason: reason
  };

  res.json({ movieData });
});

// Mock YouTube trailer
app.get('/api/youtube-trailer', mockAuth, (req, res) => {
  const { movieTitle } = req.query;
  
  if (!movieTitle) {
    return res.status(400).json({ error: 'Movie title is required' });
  }

  // Return a random trailer ID from our mock movies
  const randomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
  
  res.json({ videoId: randomMovie.youtubeId });
});

// Mock save history
app.post('/api/save-history', mockAuth, (req, res) => {
  const { mood, movieData } = req.body;
  const userId = req.user.uid;

  console.log(`[MOCK] Saving history for user ${userId}:`, { mood, movieData });

  res.json({ success: true, message: 'History saved (mock)' });
});

// Mock get history
app.get('/api/history', mockAuth, (req, res) => {
  const userId = req.user.uid;

  // Return empty history for mock
  const history = [];

  res.json({ history });
});

// Mock surprise me
app.post('/api/surprise-me', mockAuth, (req, res) => {
  // Select a completely random movie
  const randomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
  
  const movieData = {
    ...randomMovie,
    reason: `This is a delightful surprise! ${randomMovie.reason}`
  };

  res.json({ movieData });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Mock MoodMatcher Server running on http://localhost:${PORT}`);
  console.log(`📱 No API keys required - perfect for testing!`);
  console.log(`🔑 Use any email/password to login (mock authentication)`);
  console.log(`🎯 Try: "I feel happy today" or "Surprise me!"`);
}); 