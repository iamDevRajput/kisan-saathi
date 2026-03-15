const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot'
};

// Base directory for serving static files
const BASE_DIR = path.resolve('.');

const server = http.createServer((req, res) => {
    // Sanitize and resolve the requested path to prevent path traversal
    const requestedPath = path.normalize(req.url.split('?')[0]);
    let filePath = path.resolve(BASE_DIR, '.' + requestedPath);

    // Ensure the resolved path is within the base directory
    const relative = path.relative(BASE_DIR, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        res.writeHead(403);
        res.end('403 Forbidden');
        return;
    }

    if (requestedPath === '/') {
        filePath = path.join(BASE_DIR, 'premium-landing.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.stat(filePath, (statErr, stat) => {
        if (statErr) {
            if (statErr.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
            return;
        }

        // Use a long cache TTL for immutable assets, shorter for HTML
        const isHtml = extname === '.html' || extname === '';
        const cacheControl = isHtml
            ? 'no-cache'
            : 'public, max-age=31536000, immutable';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stat.size,
            'Cache-Control': cacheControl,
        });

        // Stream the file instead of loading it entirely into memory
        const stream = fs.createReadStream(filePath);
        stream.on('error', () => {
            res.end();
        });
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
});