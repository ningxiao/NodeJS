"use strict";
const os = require('os');
const url = require('url');
const http = require('http');
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
const server = http.createServer(function(req, res) {
	res.setHeader('Set-Cookie', ['name=ningxiao', 'server=vnode/1.0.1']);
	res.writeHead(200, {
		'Content-Type': 'text/plain; charset=utf-8'
	});
	res.write(`callback({"status": 200,"pid":"进程->${process.pid}"})`);
	res.end();
});

function ip() {
	let list, hostname = os.hostname();
	let network = os.networkInterfaces();
	for (let key in network) {
		list = network[key];
		for (let i = 0, len = list.length; i < len; i++) {
			if (list[i].family == "IPv4") {
				return list[i].address;
			};
		};
	};
	return "127.0.0.1";
};
(function(args) {
	let port = 80;
	if (args.length == 1) {
		port = args[0];
	};
	server.on('error', (err) => {
		if (err.code == 'EADDRINUSE') {
			console.log('服务端口被占用');
		};
	});
	server.listen(port, () => {
		console.log(ip() + `:${port}->${process.pid}`);
	});
})(process.argv.slice(2));