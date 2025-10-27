// Load the express module
const express = require('express');


// Create an Express application
const app = express();

app.use(express.json());        // (optional for later JSON bodies)
app.use(express.static('public')); // serve index.html and assets from /public

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to GoTrip Backend! 🚀');
});
app.get('/api/ping', (req, res) => {
  res.send('pong from GoTrip API');
});

// Choose a port (3000 is standard for dev)
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
