"use strict";
var auth = {};
var resmap = {};
const fs = require('fs');
const os = require('os');
const ejs = require('ejs');
const url = require('url');
const zlib = require("zlib");
const path = require('path');
const http = require("http");
const defmap = {
	"/": "/view/index.html"
};
const iszip = /^(htm|html|js|css)$/ig;
const titles = [new Buffer('{"code":200,"msg":"授权登录成功"}'), new Buffer("请求文件不存在!"), new Buffer('{"code":400,"msg":"等待授权"}')];
const mimemap = {
	"css": "text/css",
	"gif": "image/gif",
	"html": "text/html;charset=utf-8",
	"ico": "image/x-icon",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"js": "application/x-javascript;charset=utf-8",
	"json": "application/json;charset=utf-8",
	"pdf": "application/pdf",
	"png": "image/png",
	"svg": "image/svg+xml",
	"swf": "application/x-shockwave-flash",
	"tiff": "image/tiff",
	"txt": "text/plain",
	"wav": "audio/x-wav",
	"mp3": "audio/mpeg ",
	"mp4": "video/mp4",
	"ogg": "application/ogg",
	"m4a": "audio/x-m4a",
	"mp4": "video/mp4",
	"wma": "audio/x-ms-wma",
	"wmv": "video/x-ms-wmv",
	"xml": "text/xml",
	"flv": "flv-application/octet-stream",
	"appcache": "text/cache-manifest",
	"manifest": "text/cache-manifest"
};
const routing = {
	"/": function(request, response) {
		let data = {
			"appid": gUid()
		};
		console.log("访问IP" + clientip(request));
		ejs.renderFile("./view/index.html", data, function(error, tmpl) {
			let buf = new Buffer(tmpl);
			response.writeHead(200, {
				'Content-Length': buf.length,
				'Content-Type': 'text/html;charset=utf-8'
			});
			response.write(buf);
			response.end();
		});
	},
	"/login": function(request, response) {
		let buf, body = url.parse(request.url, true);
		let appid = body.query["appid"];
		if (auth[appid]) { //上次轮询之前已经授权登录
			delete resmap[appid];
			delete auth[appid];
			buf = titles[0];
			response.writeHead(200, {
				'Content-Length': buf.length,
				'Content-Type': 'text/plain;charset=utf-8'
			});
			response.write(buf);
			response.end();
		} else { //还没有授权登录挂起等待
			resmap[appid] = {
				"time": Date.now(),
				"response": response
			};
		};
	},
	"/authorize": function(request, response) {
		let obj, body = url.parse(request.url, true);
		let appid = body.query["appid"];
		let buf = titles[0];
		let data = {
			"title": "授权登录暴风商城失败"
		};
		if (appid) {
			auth[appid] = true;
			data.appid = "登录UID:" + appid;
			data.title = "授权登录暴风商城成功";
		};
		ejs.renderFile("./view/auth.html", {
			"auth": data
		}, function(error, tmpl) {
			let bufs = new Buffer(tmpl);
			response.writeHead(200, {
				'Content-Length': bufs.length,
				'Content-Type': 'text/html;charset=utf-8'
			});
			response.write(bufs);
			response.end();
		});
		if (appid) {
			obj = resmap[appid];
			if (obj) { //授权完成检测是否有等待授权挂起
				delete resmap[appid];
				delete auth[appid];
				let res = obj.response;
				res.writeHead(200, {
					'Content-Length': buf.length,
					'Content-Type': 'text/plain;charset=utf-8'
				});
				res.write(buf);
				res.end();
			};
		};
	}
};
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

function clientip(req) {
	return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
};

function gUid() { //产生ID
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == "x" ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	}).toUpperCase();
};

function httpfail(body, request, response) {
	response.writeHead(200, {
		'Content-Length': body.length,
		'Content-Type': 'text/plain;charset=utf-8'
	});
	response.write(body);
	response.end();
};

function httpsuccess(filepath, request, response) {
	fs.stat(filepath, function(err, stats) {
		let head, zlibs, encoding, extname, contenttype;
		if (err) {
			httpfail(titles[2], response);
			return;
		};
		extname = path.extname(filepath).slice(1);
		contenttype = mimemap[extname] || "text/plain;charset=utf-8";
		encoding = request.headers['accept-encoding'] || "";
		if (extname.match(iszip) && encoding) {
			if (encoding.match(/\bgzip\b/)) {
				zlibs = zlib.createGzip();
				head = {
					'content-encoding': 'gzip',
					'Content-Type': contenttype
				};
			} else if (encoding.match(/\bdeflate\b/)) {
				zlibs = zlib.createDeflate();
				head = {
					'content-encoding': 'deflate',
					'Content-Type': contenttype
				};
			};
		} else {
			response.writeHead(200, {
				'Content-Length': stats.size,
				'Content-Type': contenttype
			});
			fs.createReadStream(filepath).pipe(response);
			return;
		};
		response.writeHead(200, head);
		fs.createReadStream(filepath).pipe(zlibs).pipe(response);
	});
};
http.createServer((request, response) => {
	let host, body = url.parse(request.url, true);
	let query = body.query;
	let pathname = body.pathname;
	response.setHeader("Server", "Nxiao/V5");
	if (pathname in routing) {
		routing[pathname](request, response);
	} else {
		let host = request.headers.host;
		if (pathname.slice(-1) === "/") {
			pathname = defmap["/"];
		}
		pathname = __dirname + pathname;
		fs.exists(pathname, function(exists) {
			if (exists) {
				httpsuccess(pathname, request, response);
				return;
			};
			httpfail(titles[1], request, response);
		});
	};
}).listen(80);

function nexttick() {
	setImmediate(() => {
		let obj, buf, response;
		for (let appid in resmap) {
			obj = resmap[appid];
			response = obj.response;
			if ((Date.now() - obj.time) > 25000) {
				delete resmap[appid];
				buf = titles[2];
				response.writeHead(200, {
					'Content-Length': buf.length,
					'Content-Type': 'text/plain;charset=utf-8'
				});
				response.write(buf);
				response.end();
			} else {
				if (auth[appid]) {
					delete resmap[appid];
					delete auth[appid];
					buf = titles[0];
					response.writeHead(200, {
						'Content-Length': buf.length,
						'Content-Type': 'text/plain;charset=utf-8'
					});
					response.write(buf);
					response.end();
				};
			};
		};
		setTimeout(nexttick, 1000);
	});
};
setTimeout(nexttick, 1000);