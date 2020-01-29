const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options = { limit: Infinity }) {
    super(options);
    this._limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this._limit -= chunk.length;
    if (this._limit >= 0) {
      return callback(null, chunk);
    }
    callback(new LimitExceededError());
  }
}

module.exports = LimitSizeStream;
