let int64buffer = require('int64-buffer'),
    bigInteger = require('big-integer');

/**
 * Wrapper for buffer reading
 *
 * @param {Buffer} file
 */
class ByteArray {

  /**
   * @param {Buffer} buf
   */
  constructor(buf) {
    this.offset = 0;
    this.buf = buf;
  }

  /**
   * Check if the end of buffer was reached
   *
   * @return {Boolean}
   */
  isEof() {
    return this.offset >= this.buf.length;
  }

  /**
   * Reset internal offset to begining
   *
   */
  resetOffset() {
    this.offset = 0;
  }

  /**
   * Set specific offset
   *
   * @param {Number} offset
   */
  setOffset(offset) {
    this.offset = offset;
  }

  /**
   * Shift offset in the file by a delta
   *
   * @param {Number} delta
   */
  shiftOffset(delta) {
    this.offset += delta;
  }

  /**
   * Get current offset
   *
   * @return {Number}
   */
  getOffset() {
    return this.offset;
  }

  /**
   * Get size of internal buffer
   *
   * @return {Number}
   */
  getLength() {
    return this.buf.length;
  }

  /**
   * Get underlying buffer object
   *
   * @return {Buffer}
   */
  getBuffer() {
    return this.buf;
  }

  readInt8() {
    let value = this.buf.readInt8(this.offset);
    this.offset += 1;

    return value;
  }

  readUInt8() {
    let value = this.buf.readUInt8(this.offset);
    this.offset += 1;

    return value;
  }

  readInt16() {
    let value = this.buf.readInt16LE(this.offset);
    this.offset += 2;

    return value;
  }

  readUInt16() {
    let value = this.buf.readUInt16LE(this.offset);
    this.offset += 2;

    return value;
  }

  readInt32() {
    let value = this.buf.readInt32LE(this.offset);
    this.offset += 4;

    return value;
  }

  readUInt32() {
    let value = this.buf.readUInt32LE(this.offset);
    this.offset += 4;

    return value;
  }

  readInt64() {
    let int = new int64buffer.Int64LE(
      this.buf.slice(this.offset, this.offset + 9)
    );
    this.offset += 8;

    return bigInteger(int.toString());
  }

  readUInt64() {
    let int = new int64buffer.Uint64LE(
      this.buf.slice(this.offset, this.offset + 9)
    );
    this.offset += 8;

    return bigInteger(int.toString());
  }

  readFloat() {
    let value = this.buf.readFloatLE(this.offset);
    this.offset += 4;

    return value;
  }

  readDouble() {
    let value = this.buf.readDoubleLE(this.offset);
    this.offset += 8;

    return value;
  }

  readChar() {
    return String.fromCharCode(this.readInt8());
  }

  readString(length, encoding = 'utf8') {
    if (!length || length < 0) return '';

    let str = this.buf.toString(encoding, this.offset, this.offset + length);
    this.offset += length;

    return str;
  }

  readUTFString(length) {
    if (!length || length < 0) return '';

    length = length * 4;
    let str = this.buf.toString('utf8', this.offset, this.offset + length + 1);
    this.offset += length;

    return str;
  }

  readByteArray(length) {
    let buf = Buffer.alloc(length);
    this.buf.copy(buf, 0, this.offset, this.offset + length + 1);
    this.offset += length;

    return buf;
  }

  readLine(length, delimiter = '\n') {
    let str = [];
    for (let i = 0; i < length; i++) {
      let char = this.readChar();
      if (char == delimiter) break;

      str.push(char);
    }

    return str.join('');
  }

  readNullTerminatedString() {
    return this.readLine(ByteArray.MAX_STRING_LEN, '\0');
  }

}

/**
 * Max length for null-terminated string
 *
 * @type {Number}
 */
ByteArray.MAX_STRING_LEN = 255;


module.exports = ByteArray;