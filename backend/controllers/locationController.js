const { locationCategories, searchLocations, findNearbyLocations } = require('../services/locationService');

// Get all locations with filtering and search
const getAllLocations = async (req, res) => {
  try {
    const { 
      category, 
      type, 
      search, 
      limit = 50,
      offset = 0,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const searchParams = {
      category,
      type,
      search,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder
    };

    const result = searchLocations(searchParams);

    res.json({
      success: true,
      data: {
        categories: result.categories,
        totalLocations: result.totalCount,
        filteredLocations: result.filteredCount,
        pagination: {
          limit: searchParams.limit,
          offset: searchParams.offset,
          hasMore: result.filteredCount > (searchParams.offset + searchParams.limit)
        }
      },
      metadata: {
        timestamp: new Date().toISOString(),
        searchParams: searchParams
      }
    });

  } catch (error) {
    console.error('Location fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch locations',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get location details by ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false,
        error: 'Location ID is required' 
      });
    }

    let foundLocation = null;
    let categoryName = null;

    // Search through all categories
    Object.keys(locationCategories).forEach(cat => {
      const location = locationCategories[cat].locations.find(loc => loc.id === id);
      if (location) {
        foundLocation = location;
        categoryName = cat;
      }
    });

    if (!foundLocation) {
      return res.status(404).json({ 
        success: false,
        error: 'Location not found',
        id: id 
      });
    }

    // Enhance location data
    const enhancedLocation = {
      ...foundLocation,
      category: {
        id: categoryName,
        name: locationCategories[categoryName].name,
        icon: locationCategories[categoryName].icon,
        color: locationCategories[categoryName].color
      },
      coordinates: {
        latitude: foundLocation.coords[0],
        longitude: foundLocation.coords[1],
        display: `${foundLocation.coords[0].toFixed(4)}, ${foundLocation.coords[1].toFixed(4)}`
      }
    };

    res.json({
      success: true,
      location: enhancedLocation,
      metadata: {
        timestamp: new Date().toISOString(),
        categoryId: categoryName
      }
    });

  } catch (error) {
    console.error('Location detail error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch location details' 
    });
  }
};

// Find nearby locations
const getNearbyLocations = async (req, res) => {
  try {
    const { 
      coords, 
      radius = 5, 
      limit = 20,
      categories = [],
      excludeCategories = []
    } = req.body;

    // Validation
    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid coordinates required (format: [latitude, longitude])' 
      });
    }

    if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
      return res.status(400).json({ 
        success: false,
        error: 'Coordinates must be numbers' 
      });
    }

    if (radius <= 0 || radius > 50) {
      return res.status(400).json({ 
        success: false,
        error: 'Radius must be between 0 and 50 km' 
      });
    }

    const searchParams = {
      coords,
      radius: parseFloat(radius),
      limit: parseInt(limit),
      categories: Array.isArray(categories) ? categories : [],
      excludeCategories: Array.isArray(excludeCategories) ? excludeCategories : []
    };

    const nearbyLocations = findNearbyLocations(searchParams);

    // Group by category for better organization
    const groupedResults = {};
    nearbyLocations.forEach(location => {
      if (!groupedResults[location.category]) {
        groupedResults[location.category] = {
          categoryInfo: {
            name: locationCategories[location.category].name,
            icon: locationCategories[location.category].icon,
            color: locationCategories[location.category].color
          },
          locations: []
        };
      }
      groupedResults[location.category].locations.push(location);
    });

    res.json({
      success: true,
      data: {
        totalFound: nearbyLocations.length,
        groupedByCategory: groupedResults,
        allLocations: nearbyLocations,
        searchCenter: {
          coordinates: coords,
          display: `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`
        }
      },
      searchParams: searchParams,
      metadata: {
        timestamp: new Date().toISOString(),
        radiusKm: searchParams.radius
      }
    });

  } catch (error) {
    console.error('Nearby locations error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to find nearby locations',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all available categories
const getCategories = async (req, res) => {
  try {
    const categories = Object.keys(locationCategories).map(key => ({
      id: key,
      name: locationCategories[key].name,
      icon: locationCategories[key].icon,
      color: locationCategories[key].color,
      locationCount: locationCategories[key].locations.length,
      types: [...new Set(locationCategories[key].locations.map(loc => loc.type))]
    }));

    res.json({
      success: true,
      categories: categories,
      totalCategories: categories.length,
      totalLocations: categories.reduce((sum, cat) => sum + cat.locationCount, 0),
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch categories' 
    });
  }
};

// Search locations with advanced filters
const searchLocationsByQuery = async (req, res) => {
  try {
    const { 
      query,
      filters = {},
      coordinates,
      maxDistance,
      sortBy = 'relevance'
    } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Search query is required' 
      });
    }

    const searchResults = [];
    const queryLower = query.toLowerCase().trim();

    // Search through all locations
    Object.keys(locationCategories).forEach(categoryKey => {
      const category = locationCategories[categoryKey];
      
      category.locations.forEach(location => {
        let relevanceScore = 0;
        let matchedFields = [];

        // Name matching (highest priority)
        if (location.name.toLowerCase().includes(queryLower)) {
          relevanceScore += 50;
          matchedFields.push('name');
        }

        // Type matching
        if (location.type.toLowerCase().includes(queryLower)) {
          relevanceScore += 30;
          matchedFields.push('type');
        }

        // Description matching
        if (location.description && location.description.toLowerCase().includes(queryLower)) {
          relevanceScore += 20;
          matchedFields.push('description');
        }

        // Address matching
        if (location.address && location.address.toLowerCase().includes(queryLower)) {
          relevanceScore += 25;
          matchedFields.push('address');
        }

        // Facilities matching
        if (location.facilities) {
          const facilitiesMatch = location.facilities.some(facility => 
            facility.toLowerCase().includes(queryLower)
          );
          if (facilitiesMatch) {
            relevanceScore += 15;
            matchedFields.push('facilities');
          }
        }

        // If there's a match, add to results
        if (relevanceScore > 0) {
          const result = {
            ...location,
            category: categoryKey,
            categoryInfo: {
              name: category.name,
              icon: category.icon,
              color: category.color
            },
            searchRelevance: {
              score: relevanceScore,
              matchedFields: matchedFields
            }
          };

          // Add distance if coordinates provided
          if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
            const distance = calculateDistance(
              coordinates[0], coordinates[1],
              location.coords[0], location.coords[1]
            );
            result.distance = {
              km: Math.round(distance * 100) / 100,
              display: `${Math.round(distance * 100) / 100} km away`
            };

            // Filter by max distance if specified
            if (maxDistance && distance > maxDistance) {
              return; // Skip this location
            }
          }

          searchResults.push(result);
        }
      });
    });

    // Sort results
    if (sortBy === 'relevance') {
      searchResults.sort((a, b) => b.searchRelevance.score - a.searchRelevance.score);
    } else if (sortBy === 'distance' && coordinates) {
      searchResults.sort((a, b) => (a.distance?.km || 0) - (b.distance?.km || 0));
    } else if (sortBy === 'name') {
      searchResults.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({
      success: true,
      query: query,
      results: searchResults,
      totalResults: searchResults.length,
      searchMetadata: {
        timestamp: new Date().toISOString(),
        sortBy: sortBy,
        hasCoordinates: !!coordinates,
        maxDistance: maxDistance
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Search failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function (should be in utils, but including here for completeness)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = {
  getAllLocations,
  getLocationById,
  getNearbyLocations,
  getCategories,
  searchLocationsByQuery
};
