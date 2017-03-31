"use strict";
const fs = require('fs');
const url = require('url');
const https = require('https');
const options = {
	key: fs.readFileSync('./ca/server.key'), //加载https证书
	cert: fs.readFileSync('./ca/server.crt')
};
const server = https.createServer(options, (req, res) => {
	let body = url.parse(req.url, true);
	let uid = body.query["uid"];
	let callback = body.query["callback"];
	let data = `{"name":"nxiao","age":18,"uid":"${uid}"}`;
	if (callback) {
		data = `${callback}(${data})`;
	};
	res.writeHead(200, {
		'Content-Length': Buffer.byteLength(data),
		'Content-Type': 'text/plain;charset=utf-8'
	});
	res.write(data);
	res.end();
});
server.on('error', (err) => {
	console.log(err);
});
server.listen(8080);
$.ajax({
	type: "get", //使用get方法访问后台
	url: "https://192.168.203.71:8080",
	data: "uid=4x7sw8s",
	dataType: "jsonp", //返回json格式的数据
	timeout: 15000,
	success: function(res) {
		console.log(res);
	}
});