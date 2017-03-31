var fs = require('fs');
var utils = require('../utils/Utils');
var config = require('../model/Config');
var queuedb = require('../model/QueueDB');
var qudb;

function _resolveBuffer(buf, len) {
	var arr = [],
		index = utils.getqueueSize(buf, 8);
	console.log(utils.getqueueSize(buf, 4), utils.getqueueSize(buf, 0), buf.toString("utf-8", 8));
	for (var i = 0; i < len; i++) {}
	return "++++++++++++++";
}
/**
 * 给缓存创建映射
 * @param key 队列名称
 */
function _addCachedb(key, data) {
	qudb || (qudb = {});
	qudb[key] = data;
}
/**
 * 删除缓存映射
 * @param key 队列名称
 */
function _delCachedb(key) {
	var db;
	if (key in qudb) {
		db = qudb[key];
		for (var i = 0, l = db.length; i < l; i++) {
			db[i].length = 0;
			db[i] = null;
		}
		qudb[key] = null;
		delete qudb[key];
	}
}
/**
 * 队列服务启动时检查是否存在上一次缓存队列
 * @param callback 回调函数
 */
function init(callback) {
	fs.readdir(config.dbpath, function(err, files) {
		if (!err) {
			qudb = {};
			for (var index in files) {
				_addCachedb(files[index], []);
			}
		}
		callback(err);
	});
}
/**
 * 创建队列文件
 * @param name 队列名称
 * @param data 队列内容包含队列头的学习包
 */
function createQueue(socket, suee) {
	var queue = suee ? config.success : config.fail;
	socket.end(queue);
	socket = null;
}
/**
 * 添加数据到指定队列库，如果队列库不存在创建队列库
 * @param name 库名称
 * @param data 数据
 * @param level 优先级别
 */
function addQueue(socket, suee) {
	var queue = suee ? config.success : config.fail;
	socket.end(queue);
	socket = null;
}
/**
 * 获取队列数据
 * @param key 队列名称
 * @param len 获取几个消息
 * @param level 优先级别
 */
function getQueue(socket, key, len, level) {
	var arr, queue;
	if (qudb && key in qudb) {
		arr = qudb[key];
		if (!arr[level] || utils.getqueueSize(arr[level]) < len) {
			arr[level] = queuedb.cachedb(key, level);
		}
		queue = _resolveBuffer(arr[level], len);
	}
	socket.end(queue + "");
	socket = null;
}
/**
 * 删除指定队列库
 * @param key
 */
function delQueue(key) {
	return "删除成功！";
}
/**
 * 接口请求分析
 * @param socket
 * @param data
 */
function analysisFactory(socket, data) {
	var pathname = utils.pathname(data);
	if (pathname != "/" && config.router[pathname]) {
		switch (pathname) {
			case "/add":
				var buf = new Buffer(23);
				utils.setqueueSize(buf, 1);
				utils.setqueueSize(buf, 8, 4);
				buf.write('宁肖开始的', 8);
				queuedb.pushdb("log", buf, socket, addQueue);
				break;
			case "/del":
				queue = delQueue();
				break;
			case "/get":
				getQueue(socket, "log", 1, "0");
				break;
			case "/cre":
				queuedb.createdb("log", socket, createQueue);
				break;
			default:
		}
	} else {
		socket.end(config.queue);
		socket = null;
	}
}
exports.init = init;
exports.analysisFactory = analysisFactory;