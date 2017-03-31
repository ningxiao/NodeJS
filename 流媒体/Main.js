var os = require("os");
var fs = require("fs");
var net = require('net');
var worker = require('child_process');
var cpus = os.cpus().length;
var workers = [],port = 3000,server,fork;
function message(msg){
    console.log(msg);
}
server = net.createServer(function(socket){
	socket.on('end', function() {
		console.log('server disconnected');
	});
	socket.pause();
    fork = workers.shift();
    fork.send('c',socket,{track:false,process:false});
    workers.push(fork);
});
server.on('error', function (error) {
    if (error.code == 'EADDRINUSE') {
        console.log('服务端口被占用');
    }
});
server.listen(port, function() {
	for(var i=0;i<cpus;i++){
		fork = worker.fork("Server.js",['normal']);
		fork.on('message',message);
		workers.push(fork);
	}		
	console.log('服务开启');
});