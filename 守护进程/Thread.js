"use strict";
const fs = require("fs");
const spawn = require('child_process').spawn;
const arg = process.argv.slice(2);
const total = 3;
let child, sum = 0;
let datasource = JSON.parse(fs.readFileSync("./config/config.json", "utf-8"));

function log(str) {
	let now = new Date();
	let time = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	str = '[' + time + '] ' + str + '\r\n';
	fs.appendFileSync("./log/err.log", str, {
		"encoding": "utf-8"
	});
};

function restart() {
	if (sum >= total) {
		log("重启超过3次");
		process.exit(0);
	};
	child = spawn('node', arg, {
		detached: true
	});
	child.stdout.on('data', function(data) {
		console.log(data.toString());
	});
	// 添加一个end监听器来关闭文件流
	child.stdout.on('end', function(data) {
		console.log(data);
	});
	// 当子进程退出时，检查是否有错误，同时关闭文件流
	child.on('exit', function(code) {
		if (code != 0) {
			sum++;
			log("工作进程异常重启第" + sum + "次");
			restart();
		};
	});
	datasource.cpid = [child.pid];
	fs.writeFileSync("./config/config.json", JSON.stringify(datasource), {
		"encoding": "utf-8"
	});
	console.log("进程" + child.pid);
};
restart();