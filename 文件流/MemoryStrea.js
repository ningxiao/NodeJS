const { Readable } = require('stream');
class MemoryStrea extends Readable {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
    }
    _read(size){
        this.push(process.memoryUsage());
    }
}
module.exports = MemoryStrea;