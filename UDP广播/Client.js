var PORT = 33333;
var HOST = '192.168.203.71';
var dgram = require('dgram');
var message = new Buffer("你好服务端我是客户端");
var client = dgram.createSocket('udp4'); // ipv4
client.on("error", function(err) {
    console.log("server error:\n" + err.stack);
    client.close();
});
client.on('listening', function() {
    var address = client.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
client.on('message', function(mes, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + mes);
});
// setInterval(function() {
//     client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
//         if (err) throw err;
//         console.log("发送成功！");
//     });
// }, 2000);