"use strict";
const net = require('net');
let buf = 'hello nodejs';
let res = ['HTTP/1.1 200 OK', 'server:nxiao', 'content-length:' + buf.length].join('\r\n') + '\r\n\r\n' + buf;

process.on('message', function(m, socket) {
    console.log('负载运行PID = %d', process.pid);
    socket.readable = socket.writable = true;
    socket.end(res);
});