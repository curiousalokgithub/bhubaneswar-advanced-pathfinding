#!/usr/bin/env node

// Deployment Status Checker
// Run this script to verify deployment status

const https = require('https');
const http = require('http');

const frontendUrl = 'https://bhubaneswar-advanced-pathfinding.vercel.app';
const backendUrl = 'https://bhubaneswar-pathfinding-api.onrender.com/api/health';

console.log('🚀 Checking Deployment Status...\n');

// Check Frontend
function checkUrl(url, name) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      console.log(`✅ ${name}: Status ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`   🌟 ${name} is LIVE and working!`);
      } else {
        console.log(`   ⚠️  ${name} returned status ${res.statusCode}`);
      }
      resolve(res.statusCode);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name}: Connection failed`);
      console.log(`   Error: ${err.message}`);
      resolve(null);
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ${name}: Request timeout`);
      req.destroy();
      resolve(null);
    });
  });
}

async function checkDeployments() {
  console.log('Frontend URL:', frontendUrl);
  await checkUrl(frontendUrl, 'Frontend (Vercel)');
  
  console.log('\nBackend URL:', backendUrl);
  await checkUrl(backendUrl, 'Backend API (Render)');
  
  console.log('\n📋 Next Steps:');
  console.log('1. If Frontend is live: ✅ Your UI changes should be visible');
  console.log('2. If Backend is not responding: ⏳ Render might still be building');
  console.log('3. Check Render dashboard for build status');
  console.log('4. Verify environment variables are set correctly');
  
  console.log('\n🔗 Quick Links:');
  console.log('• Frontend: ' + frontendUrl);
  console.log('• Backend Health: ' + backendUrl);
  console.log('• GitHub Repo: https://github.com/curiousalokgithub/bhubaneswar-advanced-pathfinding');
}

checkDeployments();
