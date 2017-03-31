var os = require("os");
var net = require('net');
var config = require('./com/config');
var worker = require('child_process');
var gateway = require('./com/gateway');
var socketHead = require('./com/socketHead');
var fork,SOCKETSERVER,PORT = 6969,uidmap = {},workers = [],cpus = os.cpus().length;
function MessageFork(msg){
    if(msg.key == 'uidmap') {
        uidmap[msg.uid] = msg.map;
        for(var i=0;i<workers.length;i++){
            workers[i].send({"key":"uidmap","map":uidmap});
        }       
    }
}
/**
* 初始化创建对应cpu数量的子进程
* 并且初始化通知各个子进程现在模板映射对象
**/
function Allocationfork(){
    for(var i=0;i<cpus;i++){
        fork = worker.fork(config.SERVERPATH,['normal']);
        fork.on('message',MessageFork);
        fork.send({"key":"uidmap","map":uidmap});
        workers.push(fork);
    }   
}
function OpenStdin(){
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (news) { 
        news = news.replace(/\n/g,"");
        for(var i=0,l=workers.length;i<l;i++){
            workers[i].send({"key":"push","map":news});            
        }
    });    
}
SOCKETSERVER = net.createServer(function(socket){
    socket.pause();
    socket.setTimeout(0);
    socket.setNoDelay(true);
    fork = workers.shift();
    fork.send(config.ACCESS,socket,{track:false,process:false});
    workers.push(fork);
});
SOCKETSERVER.on('error', function (error) {
    if (error.code == 'EADDRINUSE') {
        console.log('服务端口被占用');
    }
});
process.on('exit', function(error) {
   console.log(error);
});
//监听异常退出输出日志
process.on('uncaughtException', function(error) {
    console.log(error); 
}); 
function main(argv) {
    if(argv.length == 1){
        PORT = argv[0];
    }   
    SOCKETSERVER.listen(PORT, function() {
        Allocationfork();
        OpenStdin();
        console.log('服务开启'); 
    });  
}
main(process.argv.slice(2));
