# Bhubaneswar Advanced Pathfinding Backend API

A sophisticated backend API for real-time route calculation and location services in Bhubaneswar, Odisha.

## 🚀 Features

- **Real-time Route Calculation**: Advanced pathfinding with multiple transport modes
- **Dynamic Pricing**: Real-time cost estimation based on current market rates
- **Location Services**: Comprehensive database of Bhubaneswar landmarks and services
- **Rate Limiting**: Built-in API protection and abuse prevention
- **Environmental Impact**: CO2 emissions calculation for different transport modes
- **Search & Discovery**: Advanced location search with filters and categories

## 🛠️ Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Language**: JavaScript (CommonJS)
- **Dependencies**: cors, dotenv, morgan

## 📡 API Endpoints

### Routes API (`/api/routes`)
- `POST /calculate-route` - Calculate optimal route between two points
- `POST /get-pricing` - Get pricing for all transport modes
- `GET /health` - Routes service health check

### Locations API (`/api/locations`)
- `GET /locations` - Get all locations with filtering
- `GET /locations/:id` - Get specific location details
- `GET /categories` - Get all location categories
- `POST /locations/nearby` - Find nearby locations
- `POST /search` - Advanced location search

### General
- `GET /api/health` - Overall API health status
- `GET /` - API documentation and endpoints

## 🚦 Rate Limits

- **General API**: 100 requests per 15 minutes
- **Route Calculations**: 30 requests per minute
- **Search Requests**: 20 requests per minute
- **Location Requests**: 50 requests per 5 minutes

## 🌐 Transport Modes Supported

- **Walking** - Free, eco-friendly option
- **Cycling** - Sustainable transport
- **Auto-rickshaw** - Most popular in Bhubaneswar
- **Bus** - Public transport
- **Car** - Private vehicle (Ola/Uber)
- **Bike** - Two-wheeler taxi (Rapido)

## 📍 Location Categories

- **Landmarks & Heritage** - Temples, historical sites
- **Educational** - Universities, colleges
- **Healthcare** - Hospitals, clinics
- **Transport Hubs** - Railway, airport, bus terminals
- **Shopping** - Malls, markets
- **Restaurants & Food** - Dining options

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=production
API_VERSION=2.0.0
FRONTEND_URL=https://your-frontend-domain.com
```

## 🚀 Deployment

### Render Deployment
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables
5. Deploy

### Local Development
```bash
npm install
npm run dev
```

## 📊 API Response Format

All API responses follow this structure:
```json
{
  "success": true|false,
  "data": {...},
  "metadata": {
    "timestamp": "ISO string",
    "apiVersion": "2.0.0"
  }
}
```

## 🔒 Security Features

- CORS protection
- Rate limiting per IP
- Request validation
- Error handling
- Security headers

## 📈 Monitoring

- Request logging
- Error tracking
- Performance metrics
- Health checks

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🌟 Key Features Highlight

### Real-time Pricing
- Based on actual Ola, Uber, Rapido rates
- Peak hour surge pricing
- Market variation consideration

### Environmental Impact
- CO2 emissions calculation
- Eco-friendly recommendations
- Carbon offset estimation

### Smart Recommendations
- Distance-based mode suggestions
- Traffic-aware timing
- Cost-benefit analysis

## 🔗 Links

- **Repository**: https://github.com/curiousalokgithub/bhubaneswar-advanced-pathfinding
- **Frontend**: [Link to frontend deployment]
- **API Documentation**: [Deployed API URL]/

---

Built with ❤️ for the smart city of Bhubaneswar
