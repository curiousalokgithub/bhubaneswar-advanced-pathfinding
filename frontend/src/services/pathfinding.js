// Advanced pathfinding algorithms for portfolio demonstration

class BhubaneswaarPathfinder {
  constructor() {
    // Sample graph of Bhubaneswar locations with weights
    this.locations = {
      'Railway_Station': { x: 20.2961, y: 85.8245, type: 'transport' },
      'Lingaraj_Temple': { x: 20.2372, y: 85.8280, type: 'heritage' },
      'KIIT_University': { x: 20.3556, y: 85.8178, type: 'education' },
      'Kalinga_Stadium': { x: 20.2812, y: 85.8045, type: 'sports' },
      'Master_Canteen': { x: 20.2654, y: 85.8315, type: 'commercial' },
      'Patia_Square': { x: 20.3504, y: 85.8100, type: 'commercial' },
      'Airport': { x: 20.2539, y: 85.8178, type: 'transport' },
      'Utkal_University': { x: 20.3048, y: 85.8144, type: 'education' },
      'Khandagiri_Caves': { x: 20.1951, y: 85.7737, type: 'heritage' },
      'AIIMS_Bhubaneswar': { x: 20.1845, y: 85.7753, type: 'healthcare' }
    };

    // Connection graph with distances and traffic factors
    this.connections = {
      'Railway_Station': {
        'Master_Canteen': { distance: 3.2, traffic: 0.8, type: 'city' },
        'Lingaraj_Temple': { distance: 5.1, traffic: 0.9, type: 'heritage' },
        'Kalinga_Stadium': { distance: 4.3, traffic: 0.7, type: 'city' }
      },
      'KIIT_University': {
        'Patia_Square': { distance: 2.1, traffic: 0.6, type: 'campus' },
        'Utkal_University': { distance: 6.8, traffic: 0.8, type: 'education' },
        'Master_Canteen': { distance: 8.2, traffic: 0.9, type: 'city' }
      },
      // Add more connections...
    };
  }

  // Dijkstra's algorithm with multiple optimization factors
  findOptimalRoute(start, end, preferences = {}) {
    const {
      prioritize = 'time', // 'time', 'distance', 'cost', 'safety'
      transportMode = 'car', // 'walking', 'car', 'bus', 'auto'
      avoidTraffic = true,
      includeHeritage = false
    } = preferences;

    // Implementation of modified Dijkstra with multiple weights
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(this.locations));

    // Initialize distances
    Object.keys(this.locations).forEach(location => {
      distances[location] = location === start ? 0 : Infinity;
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      const current = Array.from(unvisited).reduce((min, location) => 
        distances[location] < distances[min] ? location : min
      );

      if (current === end) break;
      if (distances[current] === Infinity) break;

      unvisited.delete(current);

      // Check neighbors
      const neighbors = this.connections[current] || {};
      Object.entries(neighbors).forEach(([neighbor, edge]) => {
        if (!unvisited.has(neighbor)) return;

        // Calculate weight based on preferences
        const weight = this.calculateWeight(edge, preferences);
        const newDistance = distances[current] + weight;

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      });
    }

    // Reconstruct path
    const path = [];
    let currentNode = end;
    while (currentNode) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }

    return {
      path,
      totalDistance: distances[end],
      estimatedTime: this.calculateTime(path, transportMode),
      estimatedCost: this.calculateCost(path, transportMode),
      routeType: prioritize
    };
  }

  // A* algorithm for faster pathfinding
  findFastestRoute(start, end) {
    const openSet = [start];
    const closedSet = new Set();
    const gScore = { [start]: 0 };
    const fScore = { [start]: this.heuristic(start, end) };
    const cameFrom = {};

    while (openSet.length > 0) {
      const current = openSet.reduce((min, node) => 
        fScore[node] < fScore[min] ? node : min
      );

      if (current === end) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.splice(openSet.indexOf(current), 1);
      closedSet.add(current);

      const neighbors = this.connections[current] || {};
      Object.entries(neighbors).forEach(([neighbor, edge]) => {
        if (closedSet.has(neighbor)) return;

        const tentativeGScore = gScore[current] + edge.distance;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= gScore[neighbor]) {
          return;
        }

        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + this.heuristic(neighbor, end);
      });
    }

    return { path: [], error: 'No path found' };
  }

  // Multi-stop trip optimization (Traveling Salesman Problem approximation)
  optimizeMultiStopTrip(start, stops, end) {
    if (stops.length === 0) {
      return this.findOptimalRoute(start, end);
    }

    // Use nearest neighbor heuristic for TSP
    const unvisited = new Set(stops);
    const route = [start];
    let current = start;

    while (unvisited.size > 0) {
      let nearest = null;
      let minDistance = Infinity;

      unvisited.forEach(stop => {
        const distance = this.calculateDirectDistance(current, stop);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = stop;
        }
      });

      route.push(nearest);
      unvisited.delete(nearest);
      current = nearest;
    }

    route.push(end);

    // Calculate detailed path between each consecutive pair
    const detailedPath = [];
    const segments = [];

    for (let i = 0; i < route.length - 1; i++) {
      const segment = this.findOptimalRoute(route[i], route[i + 1]);
      segments.push(segment);
      detailedPath.push(...segment.path.slice(0, -1));
    }
    detailedPath.push(route[route.length - 1]);

    return {
      optimizedOrder: route,
      detailedPath,
      segments,
      totalDistance: segments.reduce((sum, seg) => sum + seg.totalDistance, 0),
      totalTime: segments.reduce((sum, seg) => sum + seg.estimatedTime, 0)
    };
  }

  // Heritage trail optimizer
  createHeritageTrail(preferences = {}) {
    const heritageSpots = Object.entries(this.locations)
      .filter(([_, data]) => data.type === 'heritage')
      .map(([name, _]) => name);

    const { 
      startTime = '09:00',
      duration = 6, // hours
      includeFood = true,
      difficulty = 'easy' // easy, moderate, hard
    } = preferences;

    // Create optimized heritage route
    if (heritageSpots.length <= 1) {
      return { error: 'Not enough heritage spots for a trail' };
    }

    const trail = this.optimizeMultiStopTrip(
      heritageSpots[0], 
      heritageSpots.slice(1, -1), 
      heritageSpots[heritageSpots.length - 1]
    );

    return {
      ...trail,
      trailType: 'heritage',
      estimatedDuration: `${duration} hours`,
      startTime,
      recommendations: this.getHeritageRecommendations(trail.optimizedOrder),
      difficulty
    };
  }

  // Calculate weight based on user preferences
  calculateWeight(edge, preferences) {
    let weight = edge.distance;

    switch (preferences.prioritize) {
      case 'time':
        weight *= edge.traffic;
        break;
      case 'cost':
        weight *= this.getCostFactor(edge.type, preferences.transportMode);
        break;
      case 'safety':
        weight *= this.getSafetyFactor(edge.type);
        break;
      case 'distance':
      default:
        // Use base distance
        break;
    }

    return weight;
  }

  // Heuristic for A* (Euclidean distance)
  heuristic(node1, node2) {
    const loc1 = this.locations[node1];
    const loc2 = this.locations[node2];
    
    return Math.sqrt(
      Math.pow(loc2.x - loc1.x, 2) + Math.pow(loc2.y - loc1.y, 2)
    );
  }

  calculateDirectDistance(loc1, loc2) {
    return this.heuristic(loc1, loc2);
  }

  calculateTime(path, transportMode) {
    // Mock time calculation based on transport mode
    const speeds = {
      walking: 5, // km/h
      auto: 25,
      car: 40,
      bus: 20
    };

    const totalDistance = path.length * 2; // Approximate
    return Math.round((totalDistance / speeds[transportMode]) * 60); // minutes
  }

  calculateCost(path, transportMode) {
    const baseCosts = {
      walking: 0,
      auto: 15, // per km
      car: 8, // per km (fuel)
      bus: 10 // flat rate
    };

    const distance = path.length * 2;
    return transportMode === 'bus' ? baseCosts[transportMode] : 
           Math.round(distance * baseCosts[transportMode]);
  }

  getCostFactor(roadType, transportMode) {
    const factors = {
      highway: { auto: 1.2, car: 0.8, bus: 1.0 },
      city: { auto: 1.0, car: 1.0, bus: 1.1 },
      heritage: { auto: 1.3, car: 1.4, bus: 0.9 }
    };

    return factors[roadType]?.[transportMode] || 1.0;
  }

  getSafetyFactor(roadType) {
    const safetyFactors = {
      highway: 1.2,
      city: 1.0,
      heritage: 0.9,
      campus: 0.8
    };

    return safetyFactors[roadType] || 1.0;
  }

  reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      path.unshift(current);
    }
    return { path };
  }

  getHeritageRecommendations(spots) {
    const recommendations = {
      'Lingaraj_Temple': 'Visit early morning for peaceful darshan',
      'Khandagiri_Caves': 'Bring water and wear comfortable shoes',
      'Dhauli_Giri': 'Best visited during sunset for views'
    };

    return spots.map(spot => ({
      location: spot,
      tip: recommendations[spot] || 'Enjoy your visit!'
    }));
  }
}

export default BhubaneswaarPathfinder;
