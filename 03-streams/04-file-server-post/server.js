const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exist');
      } else {
        const limitFileSizeStream = new LimitSizeStream({limit: 100000});

        const writeFileStream = fs.createWriteStream(filepath);

        req
            .pipe(limitFileSizeStream)
            .on('error', (err) => {
              if (err) {
                res.statusCode = 413;
                res.end('413');
                fs.unlink(filepath, () => {
                  res.end();
                });
                limitFileSizeStream.destroy();
                writeFileStream.destroy();
              }
            })
            .pipe(writeFileStream)
            .on('error', (err) => {
              res.statusCode = 400;
              res.end('File not found');
              req.destroy();
            })
            .on('finish', () => {
              res.statusCode = 201;
              res.end();
              req.destroy();
            });

        req.on('aborted', () => {
          fs.unlink(filepath, () => {
            res.end();
          });
          writeFileStream.destroy();
          limitFileSizeStream.destroy();
        });
      }

      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;
