/**
 * Simple backend health check test
 * Run with: node __tests__/health.test.js
 */

const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';

/**
 * Simple HTTP request helper
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

/**
 * Test API health endpoint
 */
async function testHealthEndpoint() {
  try {
    console.log('🏥 Testing /api/health endpoint...');
    const response = await makeRequest(`${API_BASE_URL}/api/health`);
    
    const isHealthy = response.status === 200 && 
                     response.data && 
                     response.data.status === 'healthy';
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    console.log(`   Result: ${isHealthy ? '✅ PASS' : '❌ FAIL'}`);
    
    return isHealthy;
  } catch (error) {
    console.log(`   Error: ${error.message}`);
    console.log(`   Result: ❌ FAIL - Server not responding`);
    return false;
  }
}

/**
 * Test locations endpoint
 */
async function testLocationsEndpoint() {
  try {
    console.log('📍 Testing /api/locations/locations endpoint...');
    const response = await makeRequest(`${API_BASE_URL}/api/locations/locations`);
    
    const isValid = response.status === 200 && 
                   response.data && 
                   Array.isArray(response.data.data) &&
                   response.data.data.length > 0;
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Locations found: ${response.data?.data?.length || 0}`);
    console.log(`   Result: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
    
    return isValid;
  } catch (error) {
    console.log(`   Error: ${error.message}`);
    console.log(`   Result: ❌ FAIL`);
    return false;
  }
}

/**
 * Test categories endpoint  
 */
async function testCategoriesEndpoint() {
  try {
    console.log('📂 Testing /api/locations/categories endpoint...');
    const response = await makeRequest(`${API_BASE_URL}/api/locations/categories`);
    
    const isValid = response.status === 200 && 
                   response.data && 
                   Array.isArray(response.data.data) &&
                   response.data.data.length > 0;
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Categories found: ${response.data?.data?.length || 0}`);
    console.log(`   Result: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
    
    return isValid;
  } catch (error) {
    console.log(`   Error: ${error.message}`);
    console.log(`   Result: ❌ FAIL`);
    return false;
  }
}

/**
 * Run all backend tests
 */
async function runBackendTests() {
  console.log('🧪 Running backend smoke tests...');
  console.log(`🔗 API Base URL: ${API_BASE_URL}`);
  console.log('');
  
  const tests = [
    testHealthEndpoint,
    testLocationsEndpoint,
    testCategoriesEndpoint
  ];
  
  const results = [];
  for (const test of tests) {
    const result = await test();
    results.push(result);
    console.log('');
  }
  
  const passed = results.filter(Boolean).length;
  console.log(`📊 Summary: ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All backend tests passed!');
    process.exit(0);
  } else {
    console.log('💥 Some backend tests failed!');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runBackendTests();
}

module.exports = {
  testHealthEndpoint,
  testLocationsEndpoint,
  testCategoriesEndpoint,
  runBackendTests
};
