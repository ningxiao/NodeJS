var PORT = 33333;
var HOST = '192.168.203.71';
var dgram = require('dgram'); // UDP需要引入该模块
var os = require('os');
var server = dgram.createSocket('udp4'); // ipv4        \
var message = new Buffer("你好客户端我是服务端");

function getip() {
    let list, hostname = os.hostname();
    let network = os.networkInterfaces();
    for (let key in network) {
        list = network[key];
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].family == "IPv4") {
                return list[i].address;
            };
        };
    };
    return "127.0.0.1";
};
HOST = getip();
server.on("error", function(err) {
    console.log("server error:\n" + err.stack);
    server.close();
});
server.on('listening', function() {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', function(mes, remote) {
    console.log("客服端传入" + mes);
    server.send(message, 0, message.length, remote.port, remote.address, function(err, bytes) {
        if (err) throw err;
        console.log("发送成功！");
    });
});
server.bind(PORT, HOST);