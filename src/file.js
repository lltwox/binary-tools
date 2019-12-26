let fsPromises = require('fs').promises,
    ByteArray = require('./byte-array');

/**
 * Wrapper for binary file reading
 *
 */
class File extends ByteArray {

  /**
   * @param {String|Buffer} path
   */
  constructor(path) {
    super();
    this.offset = 0;
    this.path = path;
  }

  /**
   * Load file from disk
   *
   * @private
   */
  async load() {
    try {
      this.buf = await fsPromises.readFile(this.path);
    } catch (err) {
      let newErr = new Error('Failed to read the file: ' + err.message);
      if (err.code) newErr.code = err.code;
      throw newErr;
    }
  }

}

module.exports = File;