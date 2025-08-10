# API Configuration Guide

This guide will help you set up the necessary API keys for the Bhubaneswar Advanced Pathfinding application.

## Required API Keys

### 1. Google Maps API Key

The application requires a Google Maps API key to provide real-time routing, location search, and map functionalities.

#### Steps to get Google Maps API Key:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Create a new project or select an existing one
   - Project name example: "Bhubaneswar Pathfinding"

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search and enable the following APIs:
     - **Maps JavaScript API** (for map display)
     - **Places API** (for location search and details)
     - **Directions API** (for route calculations)
     - **Distance Matrix API** (for distance calculations)
     - **Geocoding API** (for address to coordinates conversion)

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API key"
   - Copy the generated API key

5. **Secure the API Key (Important!)**
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add these URLs:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)
   - Under "API restrictions", select "Restrict key"
   - Choose the APIs you enabled above

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Application Settings
VITE_APP_NAME=Bhubaneswar Pathfinding
VITE_APP_VERSION=2.0.0
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google Maps API Key (for server-side requests)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Database Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/bhubaneswar-pathfinding

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
JWT_SECRET=your_jwt_secret_here
BCRYPT_ROUNDS=12
```

## File Structure

Your project should have this structure for environment files:

```
bhubaneswar-advanced-pathfinding/
├── frontend/
│   ├── .env                 # Frontend environment variables
│   ├── .env.example         # Template for frontend .env
│   └── ...
├── backend/
│   ├── .env                 # Backend environment variables
│   ├── .env.example         # Template for backend .env
│   └── ...
└── README.md
```

## Example .env.example Files

### Frontend .env.example

```env
# Google Maps API Key (required)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Application Settings
VITE_APP_NAME=Bhubaneswar Pathfinding
VITE_APP_VERSION=2.0.0
```

### Backend .env.example

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google Maps API Key (for server-side requests)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Database Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/bhubaneswar-pathfinding
```

## Testing the Configuration

### 1. Test Google Maps API

After setting up your API key, test it by visiting:
```
https://maps.googleapis.com/maps/api/geocode/json?address=Bhubaneswar&key=YOUR_API_KEY
```

### 2. Test Frontend Integration

1. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Visit http://localhost:3000
3. Try the following features:
   - Map should load on the homepage
   - Search for locations should work
   - Route calculation should function
   - Enhanced search page should display results

### 3. Test Backend Integration

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Test API endpoints:
   - http://localhost:5000/api/health
   - http://localhost:5000/api/locations
   - http://localhost:5000/api/travel-plans

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Check if all required APIs are enabled
   - Verify API key restrictions
   - Ensure the key is correctly added to .env files

2. **CORS Errors**
   - Verify FRONTEND_URL in backend .env
   - Check if frontend URL is correctly configured

3. **Environment Variables Not Loading**
   - Restart the development servers after adding .env files
   - Check file names (should be exactly `.env`)
   - Verify variables start with `VITE_` for frontend

4. **Maps Not Loading**
   - Check browser console for errors
   - Verify API key in frontend .env
   - Check if Maps JavaScript API is enabled

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all API keys are correctly configured
3. Ensure all required APIs are enabled in Google Cloud Console
4. Check that environment variables are properly loaded

## Security Best Practices

1. **Never commit .env files** to version control
2. **Restrict API keys** to specific domains and APIs
3. **Monitor API usage** in Google Cloud Console
4. **Rotate API keys** regularly
5. **Use different keys** for development and production

## Cost Management

1. **Set up billing alerts** in Google Cloud Console
2. **Monitor API usage** regularly
3. **Use caching** to reduce API calls
4. **Implement rate limiting** to prevent abuse

## Production Deployment

For production deployment:
1. Update CORS settings in backend
2. Use production domain in API key restrictions
3. Set NODE_ENV=production
4. Use HTTPS for all endpoints
5. Configure proper DNS and SSL certificates
