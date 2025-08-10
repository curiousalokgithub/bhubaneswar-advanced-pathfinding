# Google Maps Integration Setup Guide

## 🚀 **Complete Google Maps API Integration for Bhubaneswar Pathfinding**

This guide will help you set up Google Maps API integration to enable real-time routing, location search, and accurate pricing for any location in Bhubaneswar.

---

## 📋 **Prerequisites**

- Google Cloud Platform Account
- Credit Card (required for API billing setup)
- Basic understanding of environment variables

---

## 🔧 **Step 1: Google Cloud Setup**

### 1.1 Create or Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 1.2 Enable Required APIs
Enable the following APIs in your Google Cloud Console:

- **Places API** - For location search and autocomplete
- **Directions API** - For route calculation
- **Distance Matrix API** - For distance/duration calculations
- **Geocoding API** - For address to coordinates conversion

**To enable APIs:**
1. Go to APIs & Services > Library
2. Search for each API and click "Enable"
3. Repeat for all required APIs

### 1.3 Create API Key
1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to specific APIs and domains

---

## 🔐 **Step 2: Environment Configuration**

### 2.1 Frontend Configuration
Create or update `frontend/.env.local`:

```bash
# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Bhubaneswar Specific Settings
VITE_CITY_BOUNDS_NE_LAT=20.5
VITE_CITY_BOUNDS_NE_LNG=85.95
VITE_CITY_BOUNDS_SW_LAT=20.1
VITE_CITY_BOUNDS_SW_LNG=85.7

# Pricing Configuration
VITE_BASE_AUTO_RATE=12
VITE_BASE_BIKE_RATE=3
VITE_BASE_BUS_RATE=8
VITE_BASE_CAB_RATE=15
VITE_SURGE_MULTIPLIER=1.5
VITE_FUEL_COST_PER_KM=4.5
```

### 2.2 Backend Configuration
Create or update `backend/.env`:

```bash
# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 **Step 3: Start the Application**

### 3.1 Start Backend Server
```bash
cd backend
npm install
npm start
```

### 3.2 Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```

### 3.3 Access Advanced Routing
Visit: `http://localhost:3000/advanced-routing`

---

## ✨ **Features Available**

### 🗺️ **Smart Location Search**
- Autocomplete suggestions for any location in Bhubaneswar
- Real-time search results from Google Places API
- Current location detection with GPS

### 🛣️ **Advanced Route Calculation**
- Multiple route alternatives
- Real-time traffic data
- Different travel modes (Driving, Biking, Transit, Walking)
- Step-by-step directions

### 💰 **Accurate Pricing**
- **Auto-rickshaw**: ₹12/km + ₹10 base fare
- **Bike**: ₹3/km (no base fare)
- **Bus**: ₹8 base + ₹2/km for long distances
- **Cab**: ₹15/km + ₹20 base fare
- **Surge Pricing**: 1.5x during rush hours (8-10 AM, 6-8 PM)

### 📊 **Real-time Data**
- Traffic-adjusted timing
- Distance calculations
- Transportation cost estimates
- Route optimization

---

## 🎯 **API Endpoints Available**

### Frontend Service Calls
- `googleMapsService.searchPlaces(query)` - Search locations
- `googleMapsService.calculateRoute(origin, destination, mode)` - Get routes
- `googleMapsService.geocodeAddress(address)` - Get coordinates
- `googleMapsService.reverseGeocode(lat, lng)` - Get address

### Backend API Routes
- `POST /api/google-maps/geocode` - Geocode address
- `POST /api/google-maps/reverse-geocode` - Reverse geocode
- `GET /api/google-maps/places/search` - Search places
- `POST /api/google-maps/calculate-route` - Calculate route
- `GET /api/google-maps/health` - Service health check

---

## 🔍 **Testing the Integration**

### Test Locations in Bhubaneswar:
1. **Bhubaneswar Railway Station** to **Kalinga Stadium**
2. **KIIT University** to **Utkal University** 
3. **Patia** to **Master Canteen**
4. **Khandagiri** to **Lingaraj Temple**

### Expected Results:
- Autocomplete suggestions appear as you type
- Multiple route options with different timings
- Accurate distance and duration
- Pricing for all transport modes
- Step-by-step directions

---

## 💳 **Billing Information**

### Google Maps API Pricing:
- **Free Tier**: $200 credit per month
- **Places API**: $32 per 1000 requests
- **Directions API**: $5 per 1000 requests
- **Geocoding API**: $5 per 1000 requests

### Cost Estimation for Development:
- Daily usage (100 searches): ~$0.50
- Monthly development cost: ~$15
- Free tier covers most development needs

---

## 🛠️ **Troubleshooting**

### Common Issues:

1. **API Key Not Working**
   - Verify API key is correctly set in environment files
   - Check if required APIs are enabled
   - Ensure API key restrictions allow your domain

2. **CORS Errors**
   - Verify backend is running on port 5000
   - Check CORS configuration in backend
   - Ensure frontend URL is allowed

3. **No Search Results**
   - Verify internet connection
   - Check if Places API is enabled
   - Ensure search is within Bhubaneswar bounds

4. **Route Calculation Fails**
   - Check if Directions API is enabled
   - Verify origin and destination are valid
   - Ensure locations are accessible by selected travel mode

### Debug Mode:
Set `VITE_DEBUG_MODE=true` in frontend/.env.local to see detailed logs.

---

## 🔗 **Quick Links**

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [API Key Management](https://console.cloud.google.com/apis/credentials)
- [API Usage Dashboard](https://console.cloud.google.com/apis/api/maps-backend.googleapis.com/quotas)

---

## 📞 **Support**

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure all required APIs are enabled in Google Cloud
4. Test API key with a simple request

---

**🎉 Congratulations! You now have a fully functional Google Maps integration that provides real-time routing and pricing for any location in Bhubaneswar!**
