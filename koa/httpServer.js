"use strict";
const koa = require('koa');
const fs = require('fs');
const app = koa();
app.use(function*() {
	this.type = 'js';
	this.body = fs.createReadStream("view/play.ejs");
});
/**
 * 接收主进程对子进程的通知
 * @param  {object} head 通知消息头;
 * @return null;
 */
process.on('message', function(msg) {
	switch (msg.head) {
		case 'set action':
			console.log(msg.body);
			break;
		default:
	}
});
/**
 * 监听服务器异常退出
 * @param  {object} err 退出异常信息
 * @return null
 */
process.on('exit', function(err) {
	console.log("服务器退出");
});
/**
 * 监听服务器uncaughtException退出
 * @param  {object} err 退出异常信息
 * @return null
 */
process.on('uncaughtException', function(err) {
	console.log(err.toString());
});
module.exports = app;