const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);

  // Normalize URL path
  let filePath = req.url === '/' ? 'index.html' : req.url.substring(1);
  filePath = path.join(__dirname, filePath);

  // Secure path traversal
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 Not Found');
      return;
    }

    // Read and serve file
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    
    const stream = fs.createReadStream(filePath);
    stream.on('error', (streamErr) => {
      console.error(streamErr);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  ArcAether Server listening on port ${PORT}      `);
  console.log(`  Local URL: http://localhost:${PORT}             `);
  console.log(`  Press Ctrl+C to terminate the process.           `);
  console.log(`==================================================`);
});
