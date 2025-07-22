import React, { useEffect, useState, Suspense } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapFallback from './MapFallback';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different location types
const createCustomIcon = (color, isStart = false, isEnd = false, isCurrent = false) => {
  let iconHtml = '';
  
  if (isCurrent) {
    iconHtml = `<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(59,130,246,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; position: relative;">
      <div style="position: absolute; width: 40px; height: 40px; border: 2px solid #3b82f6; border-radius: 50%; animation: pulse 2s infinite; opacity: 0.3;"></div>
      📍
    </div>`;
  } else if (isStart) {
    iconHtml = `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">S</div>`;
  } else if (isEnd) {
    iconHtml = `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">E</div>`;
  } else {
    iconHtml = `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
  }

  return L.divIcon({
    className: 'custom-marker',
    html: iconHtml,
    iconSize: isCurrent ? [28, 28] : isStart || isEnd ? [24, 24] : [20, 20],
    iconAnchor: isCurrent ? [14, 14] : isStart || isEnd ? [12, 12] : [10, 10],
  });
};

// Bhubaneswar locations data
const bhubaneswaarLocations = {
  "Bhubaneswar Railway Station": { lat: 20.2647, lng: 85.8341 },
  "Lingaraj Temple": { lat: 20.2372, lng: 85.8344 },
  "Kalinga Stadium": { lat: 20.3096, lng: 85.8022 },
  "KIIT University": { lat: 20.3558, lng: 85.8166 },
  "Utkal University": { lat: 20.2847, lng: 85.8292 },
  "Esplanade One Mall": { lat: 20.2961, lng: 85.8245 },
  "AIIMS Bhubaneswar": { lat: 20.1847, lng: 85.8064 },
  "Khandagiri Caves": { lat: 20.2614, lng: 85.7842 },
  Dhauli: { lat: 20.1928, lng: 85.8628 },
  "Rajarani Temple": { lat: 20.2514, lng: 85.8361 },
  "Parasurameswara Temple": { lat: 20.2428, lng: 85.8358 },
  "Mukteshvara Temple": { lat: 20.2433, lng: 85.8356 },
  "Tribal Museum": { lat: 20.2725, lng: 85.8314 },
  "Ekamra Haat": { lat: 20.2597, lng: 85.8278 },
  "Regional Science Centre": { lat: 20.2514, lng: 85.8361 },
};

// Map bounds updater component
const MapBoundsUpdater = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [locations, map]);

  return null;
};

const InteractiveMap = ({
  route = null,
  selectedJourney = null,
  height = "400px",
  showAllLocations = false,
  fromCoords = null,
  toCoords = null,
}) => {
  const [mapLocations, setMapLocations] = useState([]);
  const [routeLine, setRouteLine] = useState([]);

  // If Leaflet is not available, show fallback
  if (!L) {
    return (
      <MapFallback
        selectedJourney={selectedJourney}
        route={route}
        height={height}
      />
    );
  }

  useEffect(() => {
    let locations = [];
    let pathLine = [];

    // Priority 1: Show current location and destination if provided
    if (fromCoords && toCoords) {
      locations = [
        {
          name: "Your Location",
          lat: fromCoords[0],
          lng: fromCoords[1],
          type: "current",
          isCurrent: true
        },
        {
          name: "Destination",
          lat: toCoords[0],
          lng: toCoords[1],
          type: "destination",
          isDestination: true
        }
      ];
      pathLine = [fromCoords, toCoords];
    } else if (fromCoords) {
      locations = [{
        name: "Your Location",
        lat: fromCoords[0],
        lng: fromCoords[1],
        type: "current",
        isCurrent: true
      }];
    } else if (toCoords) {
      locations = [{
        name: "Destination",
        lat: toCoords[0],
        lng: toCoords[1],
        type: "destination",
        isDestination: true
      }];
    }
    // Priority 2: Show special journey locations
    else if (selectedJourney) {
      // Show journey-specific locations
      locations = selectedJourney.locations
        .map((name) => ({
          name,
          ...bhubaneswaarLocations[name],
          type: selectedJourney.type,
        }))
        .filter((loc) => loc.lat && loc.lng);

      // Create route line for the journey
      pathLine = locations.map((loc) => [loc.lat, loc.lng]);
    } else if (route && route.steps) {
      // Show route-specific locations
      const routeLocations = route.steps
        .filter(
          (step) =>
            step.includes("Start from") ||
            step.includes("Arrive at") ||
            step.includes("Continue via")
        )
        .map((step) => {
          const locationName = step.replace(
            /^(Start from|Arrive at|Continue via)\s+/,
            ""
          );
          return {
            name: locationName,
            ...bhubaneswaarLocations[locationName],
            type: "route",
          };
        })
        .filter((loc) => loc.lat && loc.lng);

      locations = routeLocations;
      pathLine = routeLocations.map((loc) => [loc.lat, loc.lng]);
    } else if (showAllLocations) {
      // Show all major locations
      locations = Object.entries(bhubaneswaarLocations).map(
        ([name, coords]) => ({
          name,
          ...coords,
          type: "general",
        })
      );
    }

    setMapLocations(locations);
    setRouteLine(pathLine);
  }, [route, selectedJourney, showAllLocations, fromCoords, toCoords]);

  const getIconColor = (type) => {
    switch (type) {
      case "heritage":
        return "#f97316"; // Orange
      case "student":
        return "#10b981"; // Green
      case "food":
        return "#ef4444"; // Red
      case "romantic":
        return "#ec4899"; // Pink
      case "business":
        return "#6366f1"; // Indigo
      case "route":
        return "#3b82f6"; // Blue
      default:
        return "#8b5cf6"; // Purple
    }
  };

  // Center of Bhubaneswar
  const center = [20.2961, 85.8245];

  return (
    <div
      style={{ height, width: "100%" }}
      className="rounded-lg overflow-hidden shadow-lg"
    >
      <Suspense
        fallback={
          <MapFallback
            selectedJourney={selectedJourney}
            route={route}
            height={height}
          />
        }
      >
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Update map bounds based on locations */}
          <MapBoundsUpdater locations={mapLocations} />

          {/* Render markers with special start/end/current indicators */}
          {mapLocations.map((location, index) => {
            const isStart = index === 0 && mapLocations.length > 1 && !location.isCurrent;
            const isEnd = index === mapLocations.length - 1 && mapLocations.length > 1 && !location.isCurrent;
            const isCurrent = location.isCurrent || false;
            
            return (
              <Marker
                key={index}
                position={[location.lat, location.lng]}
                icon={createCustomIcon(getIconColor(location.type), isStart, isEnd, isCurrent)}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900">
                      {location.name}
                    </h3>
                    {isStart && <p className="text-sm font-medium text-green-600">📍 Starting Point</p>}
                    {isEnd && <p className="text-sm font-medium text-red-600">🏁 Destination</p>}
                    <p className="text-sm text-gray-600">
                      Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                    </p>
                    {selectedJourney && (
                      <p className="text-xs text-blue-600 mt-1">
                        Part of {selectedJourney.name}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render dotted route line from source to destination */}
          {routeLine.length > 1 && (
            <Polyline
              positions={routeLine}
              pathOptions={{
                color: selectedJourney
                  ? getIconColor(selectedJourney.type)
                  : "#3b82f6",
                weight: 4,
                opacity: 0.8,
                dashArray: "10, 10", // Always show dotted track
              }}
            />
          )}
        </MapContainer>
      </Suspense>
    </div>
  );
};

export default InteractiveMap;
