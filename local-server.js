// Local server para simular el API endpoint
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Health check endpoint handler
function handleHealthCheck(req, res) {
  const startTime = Date.now();
  
  const checks = {
    static_files: true,
    cdn_assets: Math.random() > 0.02,
    interactive_editor: Math.random() > 0.05,
    browser_compatibility: true
  };
  
  const allHealthy = Object.values(checks).every(check => check);
  const responseTime = Date.now() - startTime;
  
  const healthData = {
    status: allHealthy ? 'operational' : 'degraded',
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    uptime: {
      percentage: (99.5 + Math.random() * 0.4).toFixed(2),
      days: Math.floor(Math.random() * 30) + 1
    },
    service: {
      name: 'Programming Academy',
      version: '2.1.0',
      environment: 'development',
      type: 'Educational Platform'
    },
    checks: checks,
    metrics: {
      daily_visitors: Math.floor(Math.random() * 5000) + 10000,
      active_exercises: Math.floor(Math.random() * 50) + 150,
      completed_projects: Math.floor(Math.random() * 100) + 400,
      avg_session_time: Math.floor(Math.random() * 15) + 25
    }
  };
  
  res.writeHead(allHealthy ? 200 : 503, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(healthData, null, 2));
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Handle API routes
  if (req.url === '/api/health') {
    handleHealthCheck(req, res);
    return;
  }
  
  // Serve static files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    // Get file extension
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json'
    }[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Programming Academy corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health endpoint disponible en http://localhost:${PORT}/api/health`);
  console.log(`🔧 Modo desarrollo - simulación de datos`);
});