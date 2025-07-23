const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bhubaneswar Pathfinding API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Mock locations data (replace with your actual data)
const locations = [
  { id: 1, name: "Bhubaneswar Railway Station", lat: 20.2543, lng: 85.8468, type: "transport" },
  { id: 2, name: "Khandagiri Caves", lat: 20.2506, lng: 85.7918, type: "tourist" },
  { id: 3, name: "Lingaraj Temple", lat: 20.2376, lng: 85.8338, type: "religious" },
  { id: 4, name: "Udayagiri Caves", lat: 20.2506, lng: 85.7918, type: "tourist" },
  { id: 5, name: "Nandan Kanan Zoo", lat: 20.3962, lng: 85.8187, type: "tourist" }
];

// Routes endpoint
app.post('/api/routes', (req, res) => {
  const { from, to, mode = 'driving' } = req.body;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'From and to locations are required' });
  }

  // Mock route calculation
  const distance = Math.random() * 20 + 1; // Random distance between 1-21 km
  const duration = Math.floor(distance * 3 + Math.random() * 10); // Approximate time in minutes
  
  res.json({
    route: {
      from,
      to,
      mode,
      distance: `${distance.toFixed(1)} km`,
      duration: `${duration} minutes`,
      coordinates: [
        [from.lat, from.lng],
        [to.lat, to.lng]
      ]
    },
    status: 'success'
  });
});

// Locations endpoint
app.get('/api/locations', (req, res) => {
  const { search, type } = req.query;
  
  let filteredLocations = locations;
  
  if (search) {
    filteredLocations = locations.filter(loc => 
      loc.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (type) {
    filteredLocations = filteredLocations.filter(loc => loc.type === type);
  }
  
  res.json({
    locations: filteredLocations,
    total: filteredLocations.length
  });
});

// Export for Vercel
module.exports = app;
