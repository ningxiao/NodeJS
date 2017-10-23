const url = require('url');
const net = require('net');
const path = require('path');
const http = require('http');
const env = process.env.NX_SERVER_ENV;
/**
 * TCP访问agent开放的接口8888
 */
const redis = {
    client: (port, ip) => {
        return net.createConnection(port, ip).once('connect', () => {
            console.log('[worker]', 'tcp agent connect');
        }).once('close', (data) => {
            console.log('[worker]', 'tcp agent close');
        }).once('error', (er) => {
            console.log('[worker]', 'tcp agent error');
        });
    },
    get: (pid) => {
        return new Promise((resolve, reject) => {
            let callback = (er) => {
                resolve("xx1-xxs4sd-ssd4-xs4dsx");
            };
            client.once('data', (data) => {
                client.removeListener('error', callback);
                resolve(data);
            });
            client.once('error', callback);
            client.write(`编号${pid}工作进程`);
        });
    }
};
/**
 * 创建连接TCP连接
 */
const client = redis.client(process.argv[3], '127.0.0.1');
/**
 * 创建HTTP服务
 */
const server = http.createServer(async(request, response) => {
    let context = url.parse(request.url, true).query;
    let body = `{
        "name": "nxiao----------->${process.pid}",
        "sign": "${ await redis.get(context["pid"] || process.pid)}"
    }`;
    response.writeHead(200, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'text/plain;charset=utf-8'
    });
    response.write(body);
    response.end();
});
server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(process.argv[2] || 80);
process.on('exit', (err) => {
    console.log('[worker]', "业务进程退出");
});
process.on('message', (msg) => {
    switch (msg.head) {
        case "close":
            client && client.end();
            break;
        default:
            break;
    };
});
process.on('uncaughtException', (err) => {
    //client && client.end();
    console.log('[worker]', err.toString());
});
/**
 * 
 */
process.on('disconnect', () => {
    client && client.end();
});