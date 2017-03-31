var net = require("net");
var opts = {"host":"192.168.202.204","port":"8080"};
var server,client;
function servercall(sock){
	console.log('CONNECTED: ' +sock.remoteAddress + ':' + sock.remotePort);
	sock.on("end",function(){
		console.log('server disconnected');
	});
	// 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        //sock.end("wbddd");
        proxyServer(sock,getHeader(data));
    });
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
}
function getHeader(data){
    var header={};
    data.toString().replace(/GET\ (.*?)\ HTTP/ig,function(){
        header["Referer"] = arguments[1];
    });
    return header;
}
function proxyServer(sock,data){
    var isbool = true;
    client = new net.Socket();
    client.connect(80, "hd.baofeng.com", function() {
        var header = "";
        var referer = data["Referer"];
        header+="GET http://hd.baofeng.com/"+referer+" HTTP/1.1\r\n";
        header+="Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n";
        header+="Host: hd.baofeng.com\r\n";
        header+="Content-Type: application/x-www-form-urlencoded\r\n";
        header+="Content-Length: 0\r\n";
        header+="User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36\r\n";
        header+="Cookie: advideo86850_3=2; advideo87191_5=1; advideo87469_1=2; advideo87469_2=2; advideo87472_2=2; ykss=b02a7253c815b6501edef0e9; u=__LOGOUT__; __ysuid=1399990957848MJR\r\n";
        header+="Connection: Close\r\n\r\n";
        client.write(header);
    });
    client.on('data', function(data) {
        var buff = new Buffer(data.length);
        if(isbool){
           buff.write(data.toString().replace("暴风影音5","暴风影音8"));
        }
        sock.write(buff);
    });  
    client.on('close', function(data) {
        sock.end("");
        client.destroy();
    });       
}
function listencall(){
	console.log('server bound'+server.address().port);
}
function servercerror(error){
	server.close();
    console.log('服务器启动异常'+error.code);
}
server = net.createServer(servercall);
server.on('error',servercerror);
server.listen(opts.port,opts.host,listencall);




