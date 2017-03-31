var util = require('util');
var events = require('events');
var process = require('child_process');
var shellevents = {"SUCCESS":"shellsuccess","ERROR":"shellerror"};
//修改当前注册事件的作用域
function execshell() {
    events.EventEmitter.call(this);
    this.child;
}
util.inherits(execshell,events.EventEmitter);//使这个类继承EventEmitter  
//自定义封装派发事件
execshell.prototype.dispatchEvent = function (event) {
    this.emit(event.type, event.data);
}
//自定义封装注册事件
execshell.prototype.addEventListener = function (type, fun) {
    this.on(type, fun);
}
execshell.prototype.shsuccess = function (data) {
   this.dispatchEvent({'type': shellevents.SUCCESS, 'data': data});  
}
execshell.prototype.sherror = function (error) {
   this.dispatchEvent({'type': shellevents.ERROR, 'data': error});  
}
execshell.prototype.run = function(str){
	var seif = this;
	this.child = process.exec(str,function (error, stdout, stderr) {
		if (error !== null) {
			seif.sherror("callshell执行异常");	
		}else{
			seif.shsuccess("callshell执行完成");
		}
	});		
	this.child.stdout.setEncoding('utf8');	
}
//自定义封装注册事件
execshell.prototype.runSh = function (sh) {
	this.run(sh);
}
//自定义封装注册事件
execshell.prototype.runShFile = function (sh) {
    this.run(sh);
}
exports.shell = execshell;
exports.events = shellevents;
