var fs = require("fs");
var events = require('events');
var util = require('util');
var stream,base,head;
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
function fs_success(val) {
    var extname,type,data = JSON.parse(val),json = data.files,length,name;
    for (var i=0,len=json.length;i<len;i++) {
    	extname = "imgs/"+json[i];
    	length = extname.indexOf(".");
    	type = extname.substring(length+1);
    	name = json[i].substring(0,length);
    	head = "data:image/"+type+";base64,";
    	base = head+fs.readFileSync(extname,'base64');
		fs.writeFile("base/"+name+".txt", base, function (err) {
			if (err) {
				throw err;
			} else {
				console.log('生成base64成功！');
			}
		});   	
    };
}
//文件异常的情况下出事情
function fs_error(error) {
    console.log(error);
}
function readsConfig(url) {
	stream.addEventListener("FILESUCCESSEVENT", fs_success);
	stream.addEventListener("FILEERROREVENT", fs_error);
    fs.readFile(url, function (err, data) {
        var type = "FILEERROREVENT", file = "读取文件异常";
        if (!err) {
            type = "FILESUCCESSEVENT";
            file = data;
        }
        stream.dispatchEvent({'type': type, 'data': file});
    });
}
readsConfig("config.json");
