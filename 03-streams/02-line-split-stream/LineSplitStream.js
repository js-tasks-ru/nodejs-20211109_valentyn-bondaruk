const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.notPushedChunks = [];
  }

  _transform(chunk, encoding, callback) {
    if (chunk.toString('utf-8').includes(os.EOL)) {
      const splitedChunks = chunk.toString('utf-8').split(os.EOL);

      splitedChunks.unshift(this.notPushedChunks.join(''));

      this.notPushedChunks = [splitedChunks.pop()];

      if (splitedChunks.length > 2) {
        splitedChunks.forEach((str) => this.push(str));
      } else {
        this.push(splitedChunks.join(''));
      }
    } else {
      this.notPushedChunks.push(chunk.toString('utf-8'));
    }

    callback();
  }

  _flush(callback) {
    this.push(this.notPushedChunks.join(''));
    callback(null);
  }
}

module.exports = LineSplitStream;
