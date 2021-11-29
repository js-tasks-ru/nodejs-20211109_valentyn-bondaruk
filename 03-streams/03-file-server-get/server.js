const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const readFileStream = fs.createReadStream(filepath);

  switch (req.method) {
    case 'GET':
      readFileStream
          .on('error', (err) => {
            if (err) {
              if (pathname.includes('/')) {
                res.statusCode = 400;
                res.end('400');
                return;
              } else {
                res.statusCode = 404;
                res.end('404');
                return;
              }
            }

            res.statusCode = 200;
            res.end(data);
          })
          .pipe(res);

      req.on('aborted', () => {
        readFileStream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
