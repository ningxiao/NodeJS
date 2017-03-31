var fs = require('fs');
var net = require('net');
var http = require('http');
var worker = require('child_process');
var server;
server = http.createServer(function(request,response){
    var mp4 = 'videos/SX28_hd.mp4';
    var stat = fs.statSync(mp4);
    response.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size
    })
    var readableStream = fs.createReadStream(mp4);
    readableStream.on('end',function(){
      response.end();  
    });   
    readableStream.pipe(response);
});
//监听异常退出输出日志
process.on('uncaughtException', function(e) {
    console.log(e);
}); 
process.on("message", function(msg,socket) {
	process.nextTick(function(){
		if(msg == 'c' && socket) {
			socket.readable = socket.writable = true;
			socket.resume();
            server.connections++;
            socket.server = server;
            //触发http模块的connection事件将socket连接
            server.emit("connection",socket);
            socket.emit("connect");
            socket = null;
        }
    });
 });         