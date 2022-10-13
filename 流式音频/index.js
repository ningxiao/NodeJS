const { RStream, WStream, TransformStream } = require('./NxStream');
const rs = new RStream();
const ws = new WStream();
const ts = new TransformStream();
rs.pipe(ts).pipe(ws);
