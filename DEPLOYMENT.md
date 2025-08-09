# Deployment Guide for Bhubaneswar Pathfinding API

This guide provides step-by-step instructions for deploying the Bhubaneswar Pathfinding API to various platforms.

## 🚀 Quick Deploy to Render (Recommended)

### Prerequisites
- GitHub account
- Render account (free)
- This repository pushed to GitHub

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add backend API with deployment configuration"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `bhubaneswar-advanced-pathfinding`
   - Configure settings:
     - **Name**: `bhubaneswar-pathfinding-api`
     - **Environment**: `Node`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   API_VERSION=2.0.0
   FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment (2-3 minutes)
   - Your API will be available at: `https://your-app-name.onrender.com`

## 🌐 Alternative Deployment Options

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create bhubaneswar-pathfinding-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set API_VERSION=2.0.0

# Deploy
git subtree push --prefix backend heroku main
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend
vercel --prod
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Docker Deployment
```bash
# Build image
docker build -t bhubaneswar-pathfinding-api .

# Run container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e API_VERSION=2.0.0 \
  bhubaneswar-pathfinding-api
```

## 🔧 Configuration

### Environment Variables
Create `.env` file in backend directory:
```env
NODE_ENV=production
PORT=5000
API_VERSION=2.0.0
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://another-domain.com
```

### CORS Configuration
Update `server_new.js` CORS origins with your frontend URLs:
```javascript
const allowedOrigins = [
  'https://your-production-frontend.com',
  'https://your-staging-frontend.com',
  // ... other domains
];
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- **URL**: `/api/health`
- **Method**: GET
- **Response**: Service status, uptime, memory usage

### API Documentation
- **URL**: `/` (root endpoint)
- **Method**: GET
- **Response**: Complete API documentation

### Rate Limiting
Current limits per IP:
- General API: 100 requests/15 minutes
- Route calculations: 30 requests/minute
- Search: 20 requests/minute
- Locations: 50 requests/5 minutes

## 🧪 Testing Deployment

### Test Health Check
```bash
curl https://your-api-domain.com/api/health
```

### Test Route Calculation
```bash
curl -X POST https://your-api-domain.com/api/routes/calculate-route \
  -H "Content-Type: application/json" \
  -d '{
    "fromCoords": [20.2961, 85.8245],
    "toCoords": [20.2647, 85.8341],
    "transportMode": "auto",
    "timeOfDay": "normal"
  }'
```

### Test Location Search
```bash
curl https://your-api-domain.com/api/locations/categories
```

## 🔒 Security Considerations

### Production Checklist
- [ ] Environment variables configured
- [ ] CORS origins restricted to your domains
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Error messages don't expose sensitive info
- [ ] Logs configured for monitoring

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Monitor memory usage
- [ ] Set up error tracking (Sentry, LogRocket)

## 🚨 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Memory Issues**
```bash
# Check memory usage
node --max-old-space-size=512 server_new.js
```

**CORS Errors**
- Verify frontend domain in CORS configuration
- Check environment variables are set correctly

**Rate Limiting Too Strict**
- Adjust limits in `middleware/rateLimiting.js`
- Consider implementing user-based rate limiting

### Debug Mode
Set environment variable for detailed logs:
```bash
DEBUG=* npm start
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancer
- Deploy multiple instances
- Implement session clustering

### Vertical Scaling
- Increase server resources
- Optimize memory usage
- Use PM2 for process management

### Database Considerations
For future scaling, consider:
- MongoDB for location data
- Redis for caching
- PostgreSQL for analytics

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add deployment steps
```

### Auto-Deploy
Most platforms support auto-deployment on git push to main branch.

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **Email**: [Your email for support]
- **Documentation**: API documentation at deployed URL

---

## Quick Reference

- **API Base URL**: `https://your-domain.com/api`
- **Health Check**: `GET /api/health`
- **Routes**: `POST /api/routes/calculate-route`
- **Locations**: `GET /api/locations/locations`
- **Search**: `POST /api/locations/search`

Ready to deploy? Start with Render for the easiest setup! 🚀
