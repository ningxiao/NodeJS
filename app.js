"use strict";
/**
 *
 * 2015.10.31 07:53
 * 实验使用node5创建http请求
 *
 **/
const fs = require('fs');
const os = require('os');
const url = require('url');
const http = require('http');
const zlib = require("zlib");
const path = require('path');
const cluster = require('cluster');
const islog = true;
let httpserver, port = 80,
	reqs = 0,
	pids = {};

function getip() {
	let list, hostname = os.hostname(),
		network = os.networkInterfaces();
	for (let key in network) {
		list = network[key];
		for (let i = 0, len = list.length; i < len; i++) {
			if (list[i].family == "IPv4") {
				return list[i].address;
			}
		}
	}
	return "127.0.0.1";
};
httpserver = http.createServer(function(request, response) {
	response.write('callback({"status": 200,"data":""})');
	response.end();
})
if (cluster.isMaster) {
	let cpus = os.cpus().length;
	for (let i = 0; i < cpus; i++) {
		cluster.fork();
	}
	cluster.on('exit', function(worker, code, signal) {
		console.log('[master] ' + 'exit worker' + worker.id + ' died');
	});
} else {
	function main(argv) {
		if (argv.length == 1) {
			port = argv[0];
		}
		httpserver.on('error', function(error) {
			if (error.code == 'EADDRINUSE') {
				console.log('服务端口被占用');
			}
		});
		console.log(getip(), '--', process.pid);
		httpserver.listen(port);
	}
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
	main(process.argv.slice(2));
}