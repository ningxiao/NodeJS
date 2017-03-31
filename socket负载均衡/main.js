"use strict";
const os = require("os");
const net = require('net');
const child_process = require('child_process');
let workers = [];

function createworker() {
	let fork;
	for (let i = 0, cpus = os.cpus().length; i < cpus; i++) {
		fork = child_process.fork('./worker', ['normal']);
		workers.push(fork);
	}
}

let httpservlet = net.createServer(function(socket) {
	socket.pause();
	let fork = workers.shift();
	fork.send({}, socket, {
		track: false,
		process: false
	});
	workers.push(fork);
});
httpservlet.on('error', function(error) {
	if (error.code == 'EADDRINUSE') {
		console.log('服务端口被占用');
	}
});
httpservlet.listen(80, function() {
	createworker();
	console.log('服务器访问端口:80 ');
});
/**
 * 退出输出日志
 **/
process.on('exit', function(error) {
	console.log("服务器退出");
});
/**
 * 监听异常退出输出日志
 **/
process.on('uncaughtException', function(error) {
	console.log(error.toString());
});