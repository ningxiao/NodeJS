'use strict';
const fs = require('fs');
const url = require('url');
const zlib = require('zlib');
const http = require('http');
const https = require('https');
const chunkSplice = 2097152; // 2MB
const BufferCache = require('./BufferCache');
let timeid, videoname, vkey, cachequeue, queuesum = 4;

function concatbuf(buffs) {
	let size = 0;
	for (let i = 0, l = buffs.length; i < l; i++) {
		size += buffs[i].length;
	};
	return Buffer.concat(buffs, size);
};

function sendthread(msg) {
	//发消息通知主进程下载任务完成
	process.send({
		head: 'set success',
		body: {
			pid: process.pid,
			msg: msg
		}
	});
}
/**
 * 获取上传文件的KEY
 * @param  {string}   name    视频文件名称
 * @param  {int}   size     视频文件大小
 * @param  {function} callback 获取key回调
 */
function getvkey(name, size, callback) {
	http.get(`http://192.168.204.61/upkey?name=${name}&size= ${size}`, (res) => {
		let body = '';
		if (res.statusCode == 200) {
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				body += chunk;
			});
			res.once('end', () => {
				try {
					body = JSON.parse(body);
				} catch (e) {
					body = {
						status: 0,
						msg: "服务端异常"
					};
				};
				callback(body);
			});
		} else {
			res.resume();
		};
	}).once('error', (e) => {
		callback({
			status: 0,
			msg: "上传key请求异常"
		});
	});
};
/**
 * 开始切片文件进行上传
 * @param  {Buffer} buf
 */
function uploadcdn(data) {
	if (data) {
		let options = {
			hostname: '192.168.204.61',
			port: 80,
			path: `/upload.php?key=${vkey}&vindex=${data.vindex}`,
			method: 'POST'
		};
		let name = process.pid + "_" + data.vindex + ".mp4";
		//生成分隔数据
		let boundarykey = '----WebKitFormBoundaryjLVkbqXtIi0YGpaB';
		let buf = data.buf;
		//拼装分隔数据段
		let bufh = Buffer.from('--' + boundarykey + '\r\n' + 'Content-Disposition:form-data; name=file; filename=' + name + '\r\n' + 'Content-Type:video/mpeg4\r\n\r\n');
		let body = concatbuf([bufh, buf, Buffer.from('\r\n--' + boundarykey + '--')]);
		//发送请求
		let req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				queuesum--;
				if (queuesum <= 0) {
					sendthread();
				};
				console.log('body:' + chunk);
			});
		});
		req.once('error', function(e) {
			console.error("error:" + e);
		});
		//把boundary、要发送的数据大小以及数据本身写进请求
		req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundarykey);
		req.setHeader('Content-Length', Buffer.byteLength(body));
		req.write(body);
		req.end();
	} else {
		if (queuesum <= 0) {
			sendthread();
		};
	};
};
/**
 * 开始执行轮询上传文件
 */
function nexttick() {
	let data;
	if (data = cachequeue.read) {
		uploadcdn(data);
	} else if (cachequeue.isEnd) {
		clearTimeout(timeid);
		uploadcdn(data);
	};
};
/**
 * 开始下载指定视频文件
 * 1、获取到文件响应头时请求存储服务器接口获取上传
 */
function upload(upurl) {
	//let name = 'E:/upload/' + process.pid + '.mp4';
	let req, body = JSON.stringify("get mp4");
	let options = {
		host: url.parse(upurl).host,
		port: 443,
		method: 'GET',
		path: url.parse(upurl).pathname,
		headers: {
			'Cookie': 'locale=zh_CN',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': body.length
		}
	};
	videoname = process.pid + '.mp4';
	cachequeue = new BufferCache(chunkSplice);
	req = https.request(options, (res) => {
		//res.pipe(fs.createWriteStream(name));
		res.on('data', (chunk) => {
			cachequeue.write(chunk);
		}).once('end', () => {
			cachequeue.end();
		});
	});
	req.write(body);
	//获取视频文件大小
	req.once('response', function(res) {
		cachequeue.size = res.headers['content-length'];
		getvkey(videoname, cachequeue.size, (info) => {
			console.log("info-->", info);
			if (info.status == 1) {
				vkey = info.key;
				timeid = setInterval(nexttick, 200);
			} else {
				req.end();
				sendthread(info.msg);
			};
		});
	});
	req.once('error', function(e) {
		req.end();
		console.log(new Error('problem with request: ' + e.message));
	});
	req.end();
};
/**
 * 接收来自主进程下发的下载任务
 * @param  {head:"任务",body:{}}
 */
process.on('message', (msg) => {
	process.nextTick(function() {
		switch (msg.head) {
			case 'set upload':
				upload(msg.body.url);
				break;
			default:
		};
	});
});