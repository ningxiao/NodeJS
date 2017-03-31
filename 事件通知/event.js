var fs = require("fs");
var events = require('events');
var util = require('util');
var stream;
//修改当前注册事件的作用域
function readsEvent() {
    events.EventEmitter.call(this);
}
util.inherits(readsEvent, events.EventEmitter);//使这个类继承EventEmitter  
//自定义封装派发事件
readsEvent.prototype.dispatchEvent = function (event) {
    this.emit(event.type, event.data);
}
//自定义封装注册事件
readsEvent.prototype.addEventListener = function (type, fun) {
    this.on(type, fun);
}
stream = new readsEvent();
//当加载文件成功执行
function fs_success(val) {
   console.log(JSON.parse(val));
}
//文件异常的情况下出事情
function fs_error(error) {
    console.log(error);
}
function readsConfig(url) {
    fs.readFile(url, function (err, data) {
        var type = "FILEERROREVENT", file = "读取文件异常";
        if (!err) {
            type = "FILESUCCESSEVENT";
            file = data;
        }
        stream.dispatchEvent({'type': type, 'data': file});
    });
}
stream.addEventListener("FILESUCCESSEVENT", fs_success);
stream.addEventListener("FILEERROREVENT", fs_error);
readsConfig("data.json");
