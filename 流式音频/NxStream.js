const { Readable, Writable, Transform } = require('stream');
class RStream extends Readable {
    constructor(options) {
        super(options);
    }
    _read() {
        this.push('I ');
        this.push('Love');
        this.push('Imooc\n');
        this.push(null);
    }
}
class WStream extends Writable {
    constructor(options) {
        super(options);
        this._cachen = new Buffer('');
    }
    _write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    }
}
class TransformStream extends Transform {
    constructor() {
        super();
    }
    _transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
    }
    _flush(callback) {
        this.push('Oh Yeah');
        callback();
    }
}
module.exports = {
    RStream,
    WStream,
    TransformStream
}