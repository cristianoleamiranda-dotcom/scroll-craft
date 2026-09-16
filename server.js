// Lightweight static server that removes framing-restrictive headers so the preview panel can embed the site.
// Usage:
//   npm ci
//   HOST=0.0.0.0 PORT=8080 node server.js

const express = require('express');
const path = require('path');

const app = express();
const root = path.resolve(__dirname);

// Remove/override headers that block embedding in iframes (X-Frame-Options / frame-ancestors in CSP).
app.use((req, res, next) => {
  // Remove the legacy header if present
  res.removeHeader('X-Frame-Options');
  // Overwrite CSP to allow framing from any origin while previewing.
  // NOTE: This lowers security — do this only for local/tunnel preview environments.
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' data: blob:; frame-ancestors *;");
  next();
});

// Serve static files from repository root
app.use(express.static(root, { index: ['index.html'] }));

// fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Static server started: http://${HOST}:${PORT} (serving ${root})`);
});
