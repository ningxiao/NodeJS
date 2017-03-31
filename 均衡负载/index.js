var os = require("os");
var net = require('net');
var http = require("http");
var worker = require('child_process');
var cpus = os.cpus().length;
var workers = [],server,fork;
for(var i=0;i<cpus;i++){
	workers.push(worker.fork(__dirname + "/modules/app.js",['normal']));
}
server = net.createServer(function(socket){	
	//socket.pause();
    fork = workers.shift();
    fork.send('c',socket,{track:false,process:false});
    workers.push(fork);
});
server.listen(80, function() {
  console.log('服务开启端口80');
});