"use strict";
const fs = require("fs");
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

function start(args) {
	let child = spawn('node', args, {
		detached: true,
		stdio: 'ignore'
	});
	fs.writeFileSync("./db.json", JSON.stringify({
		"pid": child.pid,
		"config": args
	}), {
		"encoding": "utf-8"
	})
	console.log("开启任务进程" + child.pid);
	child.unref();
};

function stop(pid, callback) {
	if (!pid) {
		pid = JSON.parse(fs.readFileSync("./db.json", "utf-8")).pid;
	};
	let cmd = process.platform == 'win32' ? `taskkill /pid ${pid} /f ` : `kill -9 ${pid}`;
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			return console.log(`释放进程${pid}失败！！`);
		};
		console.log(`指定${pid}成功杀掉！`);
		callback && callback();
	});
};

function restart() {
	let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
	stop(data.pid, () => {
		start(data.config);
		console.log("从启任务成功");
	});
};
(function(args) {
	let data;
	if (args.length >= 1) {
		switch (args.shift()) {
			case "start":
				start(args);
				break;
			case "stop":
				stop();
				break;
			case "restart":
				restart();
				break;
			default:
		};
	};
})(process.argv.slice(2));