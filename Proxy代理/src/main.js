"use strict";
const fs = require('fs');
const net = require('net');
const url = require('url');
const http = require('http');
const https = require('https');
const logger = require('./utils/logger');
const querystring = require('querystring');

function request(cReq, cRes) {
    let u = url.parse(cReq.url);
    let options = {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.path,
        method: cReq.method,
        headers: cReq.headers
    };
    logger.info(cReq.url);
    let pReq = http.request(options, function(pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(cRes);
    }).on('error', function(e) {
        cRes.end();
    });
    cReq.pipe(pReq);
}

function connect(cReq, cSock) {
    let u = url.parse('http://' + cReq.url);
    logger.info(cReq.url);
    let pSock = net.connect(u.port, u.hostname, function() {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock.pipe(cSock);
    }).on('error', function(e) {
        cSock.end();
    });
    cSock.pipe(pSock);
}
let options = {
    key: fs.readFileSync('./ca/private.pem'),
    cert: fs.readFileSync('./ca/public.crt')
};
http.createServer().on('request', request).on('connect', connect).listen(8888, '0.0.0.0');
//https.createServer(options).on('request', request).on('connect', connect).listen(PROXY_PORT, '127.0.0.1');