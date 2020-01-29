const stream = require('stream');
const { EOL } = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options = {}) {
    super(options);
    this._encoding = options.encoding;
    this._lineString = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString(this._encoding);
    const valuesSplitByEOL = chunkString.split(EOL);

    if (valuesSplitByEOL.length === 1) {
      this._lineString += chunkString;
      callback(null);
    } else {
      while (valuesSplitByEOL.length > 1) {
        this._lineString += valuesSplitByEOL.shift();
        this.push(this._lineString);
        this._lineString = '';
      }

      this._lineString = valuesSplitByEOL[0];
      callback(null);
    }
  }

  _flush(callback) {
    callback(null, this._lineString);
  }
}

module.exports = LineSplitStream;
