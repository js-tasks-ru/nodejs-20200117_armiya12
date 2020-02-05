const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

function deleteFileOnServer(req, res) {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested path not allowed');
    return;
  }

  fs.unlink(filepath, callback);

  function callback(err) {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          res.statusCode = 404;
          res.end('File not found');
          break;
      
        default:
          res.statusCode = 500;
          res.end('Internal server error');
      }
    } else {
      res.statusCode = 200;
      res.end('Delete file success');
    }
  }
}

server.on('request', (req, res) => {
  switch (req.method) {

    case 'DELETE':
      deleteFileOnServer(req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
