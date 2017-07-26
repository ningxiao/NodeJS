"use strict";
const PORT = 8080;
const os = require('os');
const net = require('net');
const fork = require('child_process').fork;
const tcpserver = net.createServer({ pauseOnConnect: true });
const data = {
    head: 'socket',
    body: {
        port: 8080
    }
};
const workers = []
fork(__dirname + "/Agent.js").once('exit', () => {
    console.log('Agent关闭');
}).once('error', () => {
    console.log('Agent异常!');
}).once('message', (msg) => {
    switch (msg.head) {
        case 'success':
            let worker;
            for (var i = 0; i < os.cpus().length; i++) {
                worker = fork(__dirname + "/app/AppWorker.js").once('exit', () => {
                    console.log('AppWorker关闭');
                }).once('error', (err) => {
                    console.log('AppWorker异常!');
                });
                workers.push(worker);
            };
            tcpserver.on('connection', (socket) => {
                worker = workers.shift();
                worker.send('socket', socket, { track: false, process: false });
                workers.push(worker);
            });
            tcpserver.listen(80);
            break;
        default:
    };
}).send(data);