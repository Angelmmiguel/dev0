// NodeJS modules
const http = require('http');
const fs = require('fs');
const path = require('path');

// Errors
const errors = {
  ADDRINUSE: "EADDRINUSE"
};

// Common mime types
const mimeTypes = {
  ".html": "text/html",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".js": "text/javascript",
  ".css": "text/css"
};

// Default values
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';
const DEFAULT_ENCODING = 'utf8';

const filesByUrl = (url) => {
  if (url.endsWith("/")) {
    return [
      `${url}index.html`
    ];
  } else {
    return [
      `${url}`,
      `${url}.html`,
      `${url}/index.html`,
    ];
  }
};

const dev0 = (folders, { port }) => {
  const listenPort = port || DEFAULT_PORT;

  const server = http.createServer((req, res) => {
    const { url } = req;
    const filesToTry = filesByUrl(url);
    let file;

    filesToTry.forEach((f) => {
      folders.forEach(folder => {
        const filePath = path.isAbsolute(folder) ? path.join(folder, f) : path.join(__dirname, folder, f);
        if (file == null && fs.existsSync(filePath)) {
          file = filePath;
        }
      });
    });

    if (file == null) {
      res.writeHead(404);
      res.end(`
        <h1>Not Found</h1>
        <p>Tried files:</p>
        <ul>
          ${filesToTry.map((f) => `<li>${f}</li>`)}
        </ul>
      `, DEFAULT_ENCODING);
    } else {
      const readStream = fs.createReadStream(file);
      const mimeType = mimeTypes[path.extname(file)] || "text/plain";

      readStream.on('open', () => {
        res.writeHead(200, { "Content-Type": `${mimeType}; charset=${DEFAULT_ENCODING}` });
        readStream.pipe(res);
      });
    
      readStream.on('error', (err) => {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(err, DEFAULT_ENCODING);
      });
    }

  });

  // Started!
  console.log(`Listening on http://${DEFAULT_HOST}:${listenPort}`);
  server.listen(listenPort);

  server.on("error", (err) => {
    switch(err.code) {
      case errors.ADDRINUSE:
        console.log(`[ERROR] The port ${listenPort} is already in use. Please, use another one`);
        break;
      default:
        console.log(err);
        break;
    }
  });
};

// Store default values
dev0.defaultPort = DEFAULT_PORT;

// Export the library
module.exports = dev0;