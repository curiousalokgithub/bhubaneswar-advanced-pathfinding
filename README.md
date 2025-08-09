# 🗺️ Bhubaneswar Advanced Pathfinding System

A comprehensive full-stack application for real-time route calculation and location services in Bhubaneswar, Odisha. Built with React frontend and Node.js backend, featuring advanced pathfinding algorithms, dynamic pricing, and environmental impact analysis.

![React](https://img.shields.io/badge/React-18.0+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)
![Leaflet](https://img.shields.io/badge/Leaflet-Interactive%20Maps-brightgreen.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-blueviolet.svg)

## 🚀 Live Demo

- **Frontend**: https://bhubaneswar-advanced-pathfinding.vercel.app
- **Backend API**: https://bhubaneswar-pathfinding-api.onrender.com
- **API Documentation**: https://bhubaneswar-pathfinding-api.onrender.com/

## 🌟 **Project Overview**

This full-stack application provides intelligent route planning specifically designed for Bhubaneswar, Odisha. It combines advanced pathfinding algorithms with real-world local knowledge, real-time pricing, and environmental impact analysis to deliver comprehensive routing solutions.

### 🎯 **Key Features**

- **Real-time Route Calculation**: Advanced pathfinding with multiple transport modes
- **Dynamic Pricing**: Real-time cost estimation based on Ola, Uber, Rapido rates  
- **Location Discovery**: 19+ locations across 6 categories in Bhubaneswar
- **Interactive Map**: Visual route display with markers and directions
- **Environmental Impact**: CO2 emissions calculation for different transport modes
- **Smart Recommendations**: AI-powered transport mode suggestions

## ✨ **Features**

### 📍 **Advanced Location Services**
- **Current Location Detection**: GPS-based location with visual pulse animation
- **50+ Categorized Locations**: Organized by landmarks, education, healthcare, transport, shopping
- **Smart Suggestions**: Context-aware location recommendations
- **Interactive Filtering**: Category-based location discovery

### 🚗 **Multi-Modal Transportation**
- **6 Transport Modes**: Walking, Cycling, Auto Rickshaw, Bus, Car, Motorcycle
- **Real-Time Cost Calculation**: Distance-based pricing for each mode
- **Speed Optimization**: Mode-specific speed considerations
- **Feature Comparison**: Comfort, eco-friendliness, convenience factors

### 🗺️ **Interactive Mapping**
- **Leaflet Integration**: Professional mapping with custom markers
- **Visual Route Indicators**: Dotted lines connecting origin and destination
- **Marker Customization**: Color-coded categories with pulse animations
- **Responsive Design**: Mobile-optimized touch interface

### 🧠 **Smart Algorithms**
- **Pathfinding Implementation**: Custom Dijkstra and A* algorithms
- **Multi-Criteria Optimization**: Distance, time, cost, and comfort factors
- **Route Quality Assessment**: Optimal/Good/Fair route classifications
- **Step-by-Step Directions**: Detailed navigation instructions

## 🏗️ **Technical Architecture**

### **Full-Stack Implementation**
- **Frontend**: React 18 with modern pathfinding algorithms
- **Backend**: Node.js/Express API infrastructure (scalable for future features)
- **Current Focus**: Frontend-driven pathfinding with backend ready for data persistence

### **Frontend Stack**
- **React 18**: Modern component architecture with hooks
- **Vite**: Fast development server and build tool
- **TailwindCSS**: Utility-first styling framework
- **React Router**: Client-side routing
- **React Hot Toast**: User feedback notifications

### **Backend Stack**
- **Node.js & Express**: RESTful API server
- **Database Models**: Ready for route/location data persistence
- **Environment Configuration**: Production-ready setup
- **Modular Architecture**: Controllers, routes, and models separation

### **Mapping & Geolocation**
- **Leaflet**: Interactive map library
- **React-Leaflet**: React bindings for Leaflet
- **Browser Geolocation API**: Current location detection
- **Custom Markers**: Category-specific visual indicators

### **Data Management**
- **Frontend Data Layer**: Structured location database (50+ locations)
- **Transport Definitions**: Speed, cost, and feature specifications
- **Backend Ready**: API endpoints prepared for dynamic data management

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ and npm
- Modern browser with geolocation support

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bhubaneswar-pathfinding.git
cd bhubaneswar-pathfinding

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (for future scaling)
cd ../backend
npm install

# Start development servers
# Frontend (primary)
cd ../frontend
npm run dev

# Backend (optional - for API development)
cd ../backend
npm start
```

### Usage
1. Navigate to `http://localhost:5173`
2. Go to "Advanced Search" in the navigation
3. Click "Use Current Location" or manually enter starting point
4. Select destination from categorized suggestions
5. Choose transport mode and calculate optimal route

## 📊 **Project Structure**

```
bhubaneswar-pathfinding/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── InteractiveMap.jsx
│   │   │   └── MapFallback.jsx
│   │   ├── pages/           # Application pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── EnhancedSearchPage.jsx
│   │   │   └── SpecialJourneysPageNew.jsx
│   │   ├── data/            # Static data management
│   │   │   └── locations.js
│   │   ├── services/        # Business logic
│   │   │   └── pathfinding.js
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js API Server
│   ├── controllers/         # Route handlers
│   ├── models/              # Data models
│   ├── routes/              # API endpoints
│   ├── scripts/             # Database scripts
│   ├── server.js            # Express server
│   └── package.json
├── README.md
└── .gitignore
```

## 🎯 **Key Components**

### **EnhancedSearchPage.jsx**
- Main search interface with current location detection
- Category-based filtering system
- Transport mode selection with cost calculations
- Real-time route planning and visualization

### **InteractiveMap.jsx**
- Leaflet map integration with custom markers
- Support for current location with pulse animation
- Route visualization with dotted lines
- Responsive design with fallback component

### **locations.js**
- Comprehensive database of 50+ Bhubaneswar locations
- Categorized by landmarks, education, healthcare, transport, shopping
- Transport mode definitions with speeds and features
- Coordinates and metadata for each location

### **pathfinding.js**
- Implementation of Dijkstra and A* algorithms
- Multi-criteria route optimization
- Route quality assessment
- Performance-optimized graph traversal

## 🎨 **Visual Features**

### Location Categories & Colors
- 🏛️ **Landmarks**: Orange markers for temples and monuments
- 🎓 **Educational**: Green markers for schools and universities
- 🏥 **Healthcare**: Red markers for hospitals and clinics
- 🚌 **Public Transport**: Blue markers for transport hubs
- 🛍️ **Shopping**: Pink markers for malls and markets

### Interactive Elements
- **Current Location**: Blue pulsing animation
- **Route Visualization**: Dotted connecting lines
- **Touch-Friendly**: Mobile-optimized controls
- **Responsive Grid**: Adaptive layout for all screens

## 📈 **Performance & Optimization**

- **Code Splitting**: Lazy loading for map components
- **Memoization**: Optimized React re-renders
- **Debounced Search**: Efficient location filtering
- **Fallback Systems**: Graceful degradation for map failures
- **Mobile Optimization**: Touch-friendly interface design

## 🌍 **Future Enhancements**

- **Real-Time Traffic**: Integration with traffic APIs
- **Public Transport Schedules**: Live bus/train timings
- **Crowd-Sourced Data**: User-contributed location updates
- **Offline Capabilities**: PWA with offline map caching
- **Route History**: Save and revisit previous routes
- **Social Features**: Share routes and recommendations

## 🤝 **Contributing**

This project is designed for educational and portfolio purposes. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 **Contact**

**Project Creator**: [Your Name]  
**Portfolio**: [Your Portfolio URL]  
**LinkedIn**: [Your LinkedIn Profile]  
**Email**: [Your Email]

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Leaflet**: For excellent mapping capabilities
- **React Team**: For the amazing framework
- **TailwindCSS**: For utility-first CSS framework
- **Bhubaneswar Tourism**: For location inspiration and data
- **OpenStreetMap**: For map tile services

---

**⭐ If this project helped you in your learning journey, please give it a star!**
