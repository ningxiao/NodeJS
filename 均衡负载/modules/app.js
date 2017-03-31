var net = require('net');
var http = require('http');
var worker = require('child_process');
var server,sleep;
sleep = function(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}
server = http.createServer(function(req,res){
	//sleep(5000);//开启柱塞
	res.writeHead(200, {"Content-Type":"text/plain","Connection":"close"});
	res.end("hello, world");
});
process.on("message", function(msg,socket) {
	process.nextTick(function(){
		if(msg == 'c' && socket) {
			socket.on('end', function() {
				console.log('server disconnected');
			});
			//socket.resume();
            //触发http模块的connection事件将socket连接
            server.emit("connection",socket);
            socket.emit("connect");
            socket = null;
         }
     });
 });