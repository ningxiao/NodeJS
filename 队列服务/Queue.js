var net = require('net');
var ctrqu = require("./controller/CtrQu");
var config = require('./model/Config');
var server = net.createServer(function(socket) {
	socket.setEncoding('utf8');
	socket.once('data', function(data) {
		var index = data.indexOf("GET");
		if (index != -1) {
			index += 4;
			data = data.substring(index, data.indexOf(" ", index));
		}
		ctrqu.analysisFactory(socket, data);
	});
});
server.on('error', function(error) {
	if (error.code == 'EADDRINUSE') {
		console.log('队列服务端口被占用');
	}
});
ctrqu.init(function(error) {
	if (!error) {
		server.listen(config.port, function() {
			console.log('队列服务开启');
		});
	} else {
		console.log('队列服务启动异常！');
	}
})