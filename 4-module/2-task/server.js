const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const LimitSizeStream = require('./LimitSizeStream');

function createFileOnServer(req, res) {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested path not allowed');
    return;
  }

  const writeStream = fs.createWriteStream(filepath, { flags: 'wx' });
  const limitSizeStream = new LimitSizeStream({ limit: 1e6 });
  const createFileStream = req.pipe(limitSizeStream).pipe(writeStream);

  createFileStream.on('end', () => {
    res.statusCode = 201;
    res.end('File created');
  });

  req.on('aborted', () => {
    fs.unlinkSync(filepath);
  });

  createFileStream.on('error', (err) => {
    switch (err.code) {

      case 'LIMIT_EXCEEDED':
        res.statusCode = 413;
        res.end('File limit exceeded');
        break;

      case 'EEXIST':
        res.statusCode = 409;
        res.end('File already exists');
        break;
      
      default:
        console.log(err);
        res.statusCode = 500;
        res.end('Internal server error');
    }
  });
}

server.on('request', (req, res) => {

  switch (req.method) {
    case 'POST':
      createFileOnServer(req, res)
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
