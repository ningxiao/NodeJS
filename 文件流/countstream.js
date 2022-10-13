const stream = require('stream');
const Writable = stream.Writable;
class CountStream extends Writable {
    constructor(pattern, options) {
        super(options);
        this.count = 0;
        this.regExp = new RegExp(pattern, 'ig');
    }
    _write(chunk, encoding, callback) {
        const matches = chunk.toString().match(this.regExp);
        if (matches) {
            this.count += matches.length;
        }
        callback();
    }
    end() {
        this.emit('total', this.count);
    }
}
module.exports = CountStream;