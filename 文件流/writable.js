const { Writable } = require('stream');
class GreenStrearn extends Writable {
    constructor(options){
        super(options);   
    }
    _write(chunk, encoding, callback){
        process.stdout.write(`\u001b[32m ${chunk.toString()} \u001b[39m`);
        callback();
    }
}
process.stdin.pipe(new GreenStrearn());