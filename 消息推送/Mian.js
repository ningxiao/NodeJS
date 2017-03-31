var os = require("os");
var net = require('net');
var url = require("url");
var http = require("http");
var utils = require('./com/utils.js');
var worker = require('child_process');
var fork,HTTPSERVER,SOCKETSERVER,PORT = 6969,mysql={},workers = [],cpus = os.cpus().length;
function forkmessage(msg){
    var data = msg["data"];
    switch(msg.head){
        case "update":
          mysql[data] = true;
          console.log("验证成功"); 
        break;
        case "deldate":
          delete mysql[data];
          console.log("验证失败");  
        break;
        case "pushall":
          pushall({"head":msg.head,"data":data["news"]},data["pid"]);
        break;  
        case "pushonly":
          pushall({"head":msg.head,"data":data},data["pid"]);
        break;               
        default:
    }    
}
function pushall(news,pid){
    var fork;
    for(var key in workers){
        fork = workers[key];
        if(fork.pid != pid){
            if(fork.connected){
                fork.send(news);
            }
        }
    }
}
/**
* 初始化创建对应cpu数量的子进程
* 并且初始化通知各个子进程现在模板映射对象
**/
function allocationfork(){
    for(var i=0;i<cpus;i++){
        workers.push(addfork());
    }   
}
function addfork(){
    var fork = worker.fork("./Server",['normal']);
    fork.on('message',forkmessage);
    fork.on('error',function(){
        console.log("子进程异常");
    });
    fork.on('close',function(){
        console.log("子进程关闭");
    });
    console.log("创建新子进程");
    return fork;
}
HTTPSERVER = http.createServer(function(request,response){
    var news,socket,data = url.parse(request.url,true),query = data.query,pathname = data.pathname;
    response.writeHead(200,{"Content-Type": "text/plain;charset=utf-8"});
    if(pathname == "/push"){
        if(("news" in query) && query["news"]){
            news = query["news"];
        }else{
            news = "今天开始公测无敌浩克二";
        }
        pushall({"head":"pushall","data":"服务器广告:"+news});
        response.write("同步推送消息成功"); 
    }else{
        response.write("无效请求接口"); 
    }
    response.end();
});
SOCKETSERVER = net.createServer(function(socket){
    var uid = socket.remoteAddress +':'+ socket.remotePort;
    console.log("新连接");
    mysql[uid] = false;
    socket.pause();
    socket.setTimeout(0);
    socket.setNoDelay(true);
    fork = workers.shift();
    if(!fork.connected){
        fork = addfork();
    }
    fork.send({"head":"init"},socket,{track:false,process:false});   
    workers.push(fork);
});
SOCKETSERVER.on('error', function (error) {
    if (error.code == 'EADDRINUSE') {
        console.log('推送服务端口被占用');
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
        allocationfork();
        HTTPSERVER.listen(8888);          
        console.log('推送服务开启端口为：'+PORT); 
    });  
}
main(process.argv.slice(2));
