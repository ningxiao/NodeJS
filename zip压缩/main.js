var fs = require('fs');
var zlib = require('zlib');
var gzip = zlib.createGzip();
var inp = fs.createReadStream('input.txt');
var out = fs.createWriteStream('input.txt.gz');
inp.pipe(gzip).pipe(out);