// Mock locations data
const locations = [
  { id: 1, name: "Bhubaneswar Railway Station", lat: 20.2543, lng: 85.8468, type: "transport" },
  { id: 2, name: "Khandagiri Caves", lat: 20.2506, lng: 85.7918, type: "tourist" },
  { id: 3, name: "Lingaraj Temple", lat: 20.2376, lng: 85.8338, type: "religious" },
  { id: 4, name: "Udayagiri Caves", lat: 20.2506, lng: 85.7918, type: "tourist" },
  { id: 5, name: "Nandan Kanan Zoo", lat: 20.3962, lng: 85.8187, type: "tourist" },
  { id: 6, name: "Kalinga Stadium", lat: 20.2835, lng: 85.8245, type: "sports" },
  { id: 7, name: "Esplanade One Mall", lat: 20.2902, lng: 85.8245, type: "shopping" },
  { id: 8, name: "AIIMS Bhubaneswar", lat: 20.1901, lng: 85.6992, type: "hospital" },
  { id: 9, name: "Patia Square", lat: 20.3431, lng: 85.8082, type: "commercial" },
  { id: 10, name: "Rajarani Temple", lat: 20.2542, lng: 85.8310, type: "religious" }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
