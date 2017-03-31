var os = require('os');
var net = require('net');
var utils = require('./com/utils.js');
var HOST,PORT = 8888,attachmap={};
HOST = utils.ips()[0];
function connectionAgreement(data){
	var key,header = utils.getHeader(data);
	key = utils.shkey(header["Sec-WebSocket-Key"]);
	return utils.setHeader({"Date":new Date(),"Sec-WebSocket-Accept":key},true);
}
net.createServer(function(sock) {
	var timeuid,bytes,header,sum,key = sock.remoteAddress +':'+ sock.remotePort; 
    sock.on('data', function(data) {
        sum = 0;
    	if(key in attachmap){
    		bytes = utils.parsemsg(data);
            timeuid = setInterval(function(){
                sum++;
                if(sum>=10){
                    clearInterval(timeuid);
                }
                sock.write(utils.buildmsg(sum+"服务端返回"+bytes.toString()));
            }, 500);
    		sock.write(utils.buildmsg("服务端返回"+bytes.toString()));
    	}else{
	    	header = connectionAgreement(data);
	    	attachmap[key] = true;
	    	sock.write(header);
    	}
    });
    sock.on('end', function(data) {
    	console.log("结束");
    });  
    sock.on('error', function(data) {
    	console.log("异常");
    });        
    sock.on('close', function(data) {
    	delete attachmap[key];
    });  
}).listen(PORT, HOST);
console.log('Server listening on ' + HOST +':'+ PORT);