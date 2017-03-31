var net = require('net');
var util = require('util');
var events = require('events');
var httpHead = require('./httpHead.js');
var HttpSocketEvents = {"CONNECT":"connect_event","ERROR":"error_event"};
function HttpSocket(host,port){
	events.EventEmitter.call(this);
	this.host = host;
	this.request = null;
	this.bytelist = [];
	this.bytelen = 0;
	this.port = port || 80;
	this.connected = false;
	this.client = new net.Socket();
	this.client.on('data',this.socketProgress.bind(this));
	this.client.on('close',this.socketClose.bind(this));
	this.client.on('error',this.socketError.bind(this));	
}
util.inherits(HttpSocket, events.EventEmitter);//使这个类继承EventEmitter  
HttpSocket.prototype.load = function(request){
	this.request = request;
	this.bytelen = 0;
	this.bytelist.length = 0;
	this.connected || this.client.connect(this.port, this.host,this.socketConnect.bind(this));
}
HttpSocket.prototype.socketConnect = function(){
	this.client.write(httpHead.SetHeader(this.request));
	this.connected = true;
}
HttpSocket.prototype.socketProgress = function(data){
	this.bytelist.push(data);
	this.bytelen+=data.length;
}
HttpSocket.prototype.socketClose = function(){
	var bytes,position = 0;
	this.connected = false;
	if(this.bytelist.length>1){
		bytes = new Buffer(this.bytelen);
		for(var i=0,len = this.bytelist.length;i<len;i++){
			this.bytelist[i].copy(bytes,position);
			position+=this.bytelist[i].length;
		}
	}else{
		bytes = this.bytelist[0];
	}
	bytes  =  httpHead.GetHeader(bytes);
	this.dispatchEvent({'type': HttpSocketEvents.CONNECT, 'data':bytes});
}
HttpSocket.prototype.socketError = function(){
	this.dispatchEvent({'type': HttpSocketEvents.ERROR, 'data': "请求异常"});
}
//自定义封装派发事件
HttpSocket.prototype.dispatchEvent = function (event) {
    this.emit(event.type, event.data);
}
//自定义封装注册事件
HttpSocket.prototype.addEventListener = function (type, fun) {
    this.on(type, fun);
}
//自定义封装注册事件
HttpSocket.prototype.removeEventListener = function (type, fun) {
    this.removeListener(type, fun);
}
module.exports = {"HttpSocket":HttpSocket,"HttpSocketEvents":HttpSocketEvents};