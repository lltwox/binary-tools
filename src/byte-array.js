/**
 * Wrapper for buffer reading
 *
 * @param {Buffer} file
 */
class ByteArray {

  /**
   * @param {Buffer} buf
   */
  constructor(buf, endian = 'LE') {
    this.offset = 0;
    this.buf = buf;
    this.endian = endian;
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
   * Set new endianness
   *
   * @param {String} endian BE or LE
   */
  setEndian(endian) {
    this.endian = endian;
  }

  /**
   * Get endianness
   *
   * @return {String}
   */
  getEndian() {
    return this.endian;
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

  readInt16(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readInt16LE(this.offset) :
      this.buf.readInt16BE(this.offset);
    this.offset += 2;

    return value;
  }

  readUInt16(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readUInt16LE(this.offset) :
      this.buf.readUInt16BE(this.offset);
    this.offset += 2;

    return value;
  }

  readInt32(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readInt32LE(this.offset) :
      this.buf.readInt32BE(this.offset);
    this.offset += 4;

    return value;
  }

  readUInt32(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readUInt32LE(this.offset) :
      this.buf.readUInt32BE(this.offset);
    this.offset += 4;

    return value;
  }

  readInt64(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readBigInt64LE(this.offset) :
      this.buf.readBigInt64BE(this.offset);
    this.offset += 8;

    return value;
  }

  readUInt64(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readBigUInt64LE(this.offset) :
      this.buf.readBigUInt64BE(this.offset);
    this.offset += 8;

    return value;
  }

  readFloat(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readFloatLE(this.offset) :
      this.buf.readFloatBE(this.offset);
    this.offset += 4;

    return value;
  }

  readDouble(endian = this.endian) {
    let value = endian == 'LE' ?
      this.buf.readDoubleLE(this.offset) :
      this.buf.readDoubleBE(this.offset);
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