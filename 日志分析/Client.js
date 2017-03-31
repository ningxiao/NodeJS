var net = require('net');
var socketHead = require('./com/socketHead');
var client = new net.Socket(),HOST = '192.168.204.61',PORT = 6969;
client.on('data', function(data) {
	var heade = socketHead.GetHeader(data,true);
	console.log('服务端推送消息: ' + heade.body);
});
client.on('error', function(error) {
	console.log('连接服务器失败');
});
client.on('close', function() {
	client.destroy();
});
function main(argv) {
	if(argv.length == 1){
		HOST = argv[0];
	}   
	client.connect(PORT, HOST, function() {
		client.write(socketHead.SetHeader('/Analysislog?cid=cid17&cid=cid18'));
	});  
}
main(process.argv.slice(2));