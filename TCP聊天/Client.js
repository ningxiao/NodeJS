var net = require('net');
var utils = require('./com/utils');
var config = require('./com/config');
var gateway = require('./com/gateway');
var socketHead = require('./com/socketHead');
var HOST = '127.0.0.1',PORT = 6969,SUM = 0,isToken = 1;
var client = new net.Socket(),enckey;
function SendToken(data){
	var body,heade;
	body = data.body;
	heade = socketHead.SetHeader(gateway.DecToken(body,config.GATEWAYKEY,config.GATEWAYVI),"/admin");	
	client.write(heade);
}

client.on('data', function(data) {
	var str = "成功!",heade = socketHead.GetHeader(data,true);
	if(isToken==1){
		SendToken(heade);	
		isToken++;	
	}else if(isToken==2){
		console.log('服务端认证结果: ' + heade.body);
		client.write(socketHead.SetHeader(enckey.key,"/admin?username=宁肖&password=nx4276"));
    	isToken++;
    }else if(isToken==3){
    	if(enckey.uid != heade.body){
    		str = "失败!";
    		client.destroy();
    	}
    	isToken++;
    	console.log('客户端认证结果: ' + str);
    }else{
    	console.log('服务端推送消息: ' + heade.body);
    }
});
client.on('close', function() {
	client.destroy();
});
client.on('error', function(error) {
	console.log('连接服务器失败');
	var buf = new Buffer(3);
	console.log("slice" in buf);
});
function main(argv) {
	if(argv.length == 1){
		HOST = argv[0];
	}   
	client.connect(PORT, HOST, function() {
		enckey = gateway.EncToken(config.GATEWAYKEY,config.GATEWAYVI);
		console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	});  
}
main(process.argv.slice(2));