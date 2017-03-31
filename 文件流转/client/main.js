"use strict";
const url = require('url');
const http = require('http');
const fork = require('child_process').fork;
const port = 8080;
let maxs = 2;
let wksum = 0;
let httpserver;
let queue = [];
let workers = {};
process.on('exit', clearworker);
/**
 * 监听异常退出输出日志
 **/
process.on('uncaughtException', (error) => {
	console.log(error.toString());
});

function clearworker(pid) {
	let buf;
	if (pid) {
		wksum--;
		workers[pid].worker.kill();
		delete workers[pid];
		buf = pid + "号下载奴隶关闭";
	} else {
		for (let pid in workers) {
			workers[pid].worker.kill();
		};
		wksum = 0;
		workers = {};
		buf = "关闭全部下载奴隶";
	};
	if (queue.length && wksum <= maxs) {
		console.log("开启队列任务");
		createworker(queue.shift());
	};
	if (wksum == 0) {
		console.log("没有下载任务");
	};
	return buf;
};
/**
 * 处理来自子进程的消息
 * @param  {head:"任务",body:{}}
 */
function childmessage(msg) {
	switch (msg.head) {
		case 'set success':
			console.log(msg.body.pid + '号下载奴隶累完成任务!', msg.body.msg);
			clearworker(msg.body.pid);
			break;
		default:
	};
};

function createworker(url) {
	if (wksum <= maxs) {
		let worker = fork("./worker/upload.js");
		worker.once('exit', function() {
			delete workers[worker.pid];
		});
		worker.once('error', function() {
			console.log(worker.pid + '号下载奴隶累异常!');
			delete workers[worker.pid];
		});
		worker.once('message', childmessage);
		wksum++;
		workers[worker.pid] = {
			url: url,
			worker: worker
		};
		worker.send({
			head: 'set upload',
			body: {
				url: url
			}
		});
		return "开启下载进程" + worker.pid;
	} else { //写入任务队列
		queue.push(url);
		return "妈呀要累死还有" + queue.length + "个任务！";
	};
};
httpserver = http.createServer((request, response) => {
	let body = url.parse(request.url, true);
	let buf = "请求地址错误";
	switch (body.pathname) {
		case '/upload':
			let url;
			if (url = body.query["url"]) {
				buf = createworker(url);
			};
			break;
		case '/clear':
			buf = clearworker(body.query["pid"]);
			break;
		default:
	};
	response.writeHead(200, {
		'Content-Length': Buffer.byteLength(buf),
		'Content-Type': 'text/plain;charset=utf-8'
	});
	response.write(buf);
	response.end();
});
httpserver.on('error', (error) => {
	if (error.code == 'EADDRINUSE') {
		console.log('服务端口被占用');
	};
});
httpserver.listen(port);