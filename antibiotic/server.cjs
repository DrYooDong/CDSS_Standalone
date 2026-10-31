const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // Strip query string
  const urlPath = req.url.split('?')[0];
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(BASE_DIR, safePath);

  // If path doesn't exist, check parent shared or fallback to index.html
  if (!fs.existsSync(filePath)) {
    if (safePath.startsWith('/shared/')) {
      const sharedPath = path.join(BASE_DIR, '..', safePath);
      if (fs.existsSync(sharedPath)) {
        filePath = sharedPath;
      } else {
        filePath = path.join(BASE_DIR, 'index.html');
      }
    } else {
      filePath = path.join(BASE_DIR, 'index.html');
    }
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`InfectoDose CDSS running at http://localhost:${PORT}/`);
});
