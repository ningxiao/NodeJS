const net = require('net');
const PORT = 3000;
const HOST = '127.0.0.1';
const crypto = require('crypto');
// tcp服务端
const server = net.createServer((socket) => {
    console.log('服务端：收到来自客户端的请求');
    socket.on('data', (data) => {
        console.log(`服务端：收到客户端数据，内容为{${data}}`);
        // 给客户端返回数据
        socket.write(crypto.createHash('md5').update(data).digest('hex'));
    });
    socket.on('close', () => {
        console.log('服务端：客户端连接断开');
    });
});
server.on('close', () => {
    console.log('close事件：服务端关闭');
});
server.on('error', (er) => {
    console.log(`error事件：服务端异常：${er.message}`);
});
server.listen(PORT, HOST, function() {
    console.log(`服务端开启成功`);
});