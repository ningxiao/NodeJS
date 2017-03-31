var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;
var SUM = 0;
var client = new net.Socket();
function socketSend(){
	SUM++;
	client.write('I am Chuck Norris!'+SUM);
	setTimeout(socketSend, 500);
}
client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    setTimeout(socketSend, 500);  
});
client.on('data', function(data) {
    console.log('DATA: ' + data);
    //client.destroy();
});
client.on('close', function() {
    console.log('Connection closed');
});