const stream = require('stream');

const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
    this.bytesTransferred = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bytesTransferred += chunk.length;
    this.bytesTransferred > this.options.limit ? callback(new LimitExceededError()) : callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
