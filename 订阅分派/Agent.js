"use strict";
const net = require('net');
const HOST = '127.0.0.1';
const MYSQLDB = {
    uid: {
        "10101": {
            "name": "nxiao"
        },
        "10102": {
            "name": "maxiaowei"
        }
    }
};
const tcpserver = net.createServer((socket) => {
    socket.on('data', (buf) => {
        let uid, data = JSON.parse(buf.toString('utf-8'));
        if (data.head == "GET:UID") {
            uid = data.body.uid;
        };
        console.log('来至: ' + socket.remoteAddress + ' ' + socket.remotePort + ' ' + data.body.pid);
        socket.write(JSON.stringify(MYSQLDB.uid[uid] || { "msg": "没有查询数据" }));
    });
    socket.on('close', () => {
        console.log('连接结束: ' + socket.remoteAddress + ' ' + socket.remotePort);
    });
});
tcpserver.on('error', (err) => {
    console.log(err);
});
process.on('message', (msg) => {
    process.nextTick(() => {
        switch (msg.head) {
            case 'socket':
                tcpserver.listen({
                    host: HOST,
                    port: msg.body.port,
                    exclusive: true //单进程不共享
                }, () => {
                    process.send({
                        head: 'success',
                        body: {
                            pid: process.pid,
                            msg: "创建agent进程成功"
                        }
                    });
                });
                break;
            default:
        };
    });
});