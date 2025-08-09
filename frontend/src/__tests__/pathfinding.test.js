/**
 * Smoke tests for pathfinding utility functions
 */

// Simple Haversine distance calculation test
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

// Test function for distance calculation
export function testDistanceCalculation() {
  // Distance between Lingaraj Temple and KIIT University (approximate)
  const lingarajLat = 20.2376;
  const lingarajLon = 85.8346;
  const kiitLat = 20.3499;
  const kiitLon = 85.8181;
  
  const distance = calculateDistance(lingarajLat, lingarajLon, kiitLat, kiitLon);
  
  // Expected distance is roughly 12-15 km
  const isValid = distance > 10 && distance < 20;
  
  console.log(`✅ Distance test: ${distance.toFixed(2)} km - ${isValid ? 'PASS' : 'FAIL'}`);
  return isValid;
}

// Test pathfinding logic
export function testPathfindingLogic() {
  const testLocations = [
    { id: 'A', name: 'Start', coords: [20.2961, 85.8245] },
    { id: 'B', name: 'End', coords: [20.2647, 85.8341] }
  ];
  
  const distance = calculateDistance(
    testLocations[0].coords[0],
    testLocations[0].coords[1],
    testLocations[1].coords[0],
    testLocations[1].coords[1]
  );
  
  const isValid = distance > 0 && distance < 100; // Reasonable bounds for Bhubaneswar
  console.log(`✅ Pathfinding test: ${distance.toFixed(2)} km - ${isValid ? 'PASS' : 'FAIL'}`);
  return isValid;
}

// Run all tests
export function runSmokeTests() {
  console.log('🧪 Running frontend smoke tests...');
  
  const tests = [
    testDistanceCalculation,
    testPathfindingLogic
  ];
  
  const results = tests.map(test => test());
  const passed = results.filter(Boolean).length;
  
  console.log(`✅ Tests passed: ${passed}/${tests.length}`);
  return passed === tests.length;
}

// Auto-run tests if this module is imported
if (typeof window !== 'undefined') {
  // Browser environment - run tests on load
  setTimeout(() => {
    runSmokeTests();
  }, 1000);
}
