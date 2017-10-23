const fs = require('fs');
const net = require('net');
const crypto = require('crypto');
const PORT = process.argv[3] || 8080;
const env = process.env.NX_SERVER_ENV;
let counter = 0;
/**
 * 是否监听文件修改然后派发重启工作进程
 * @param  {String} path 监听路径
 * @param  {String} name 监听文件名称
 */
const watch = (path, name) => {
    fs.watch(path, (eventType, filename) => {
        now = new Date();
        switch (eventType) {
            case 'change':
                if (filename == name) {
                    counter++;
                    if (counter > 1) {
                        process.send({
                            head: 'agent-worker-update',
                            body: {
                                msg: '业务进程更新'
                            }
                        });
                        counter = 0;
                    };
                };
            default:
                break;
        };
    });
};
/**
 * 开启tcp服务
 * @param  {socket} 
 */
const server = net.createServer((socket) => {
    socket.on('data', (data) => { //将传回的数据md5然后二进制
        socket.write(crypto.createHash('md5').update(data).digest('hex'));
    });
    socket.once('close', function(data) {
        this.removeAllListeners();
        console.log('[agent] ', "close:", socket.remoteAddress + ' ' + socket.remotePort);
    });
    socket.once('error', function(err) {
        this.removeAllListeners();
        console.log('[agent] ', "error:", err.toString());
    });
});
server.on('close', () => {
    console.log('[agent] ', "server:", "close");
});
server.on('error', (err) => {
    console.log('[agent] ', "server:", err.toString());
});
server.listen(PORT, '127.0.0.1', () => {
    if (env == "local") { //开发环境开启自动重启
        watch(__dirname, "worker.js");
    };
    process.send({
        head: 'agent-init-success',
        body: {
            pid: process.pid,
            msg: `开启TCP-->127.0.0.1:${PORT}`
        }
    });
});
process.on('message', (msg) => {
    switch (msg.head) {
        case "reloadend":
            break;
        default:
            break;
    };
    console.log('[agent] ', msg);
});