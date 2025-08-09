# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the backend source code
COPY backend/ .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the working directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
  const options = { host: 'localhost', port: 5000, path: '/api/health', timeout: 2000 }; \
  const req = http.request(options, (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1); \
  }); \
  req.on('error', () => process.exit(1)); \
  req.end();"

# Start the application
CMD ["npm", "start"]
