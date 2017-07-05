const os = require('os');
const fs = require('fs');
const url = require('url');
const http = require('http');
const crypto = require('crypto');
const utils = {
    port: 80,
    ip: () => {
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
    },
    wrap: (body, binary) => {
        let size = body.length;
        /*
         * 数据的起始位置，如果数据长度16位也无法描述，则用64位，即8字节，如果16位能描述则用2字节，否则用第二个字节描述
         * 定义buffer，长度为描述字节长度 + message长度
         */
        let head = new Buffer(size > 65535 ? 10 : (size > 125 ? 4 : 2));
        // 第一个字节为16进制 0x81 文本  0x82 二进制数据 
        head[0] = binary ? 0x82 : 0x81;
        // 因为是由服务端发至客户端，所以无需masked掩码
        if (size > 65535) {
            head[1] = 127;
            // 长度超过65535的则由8个字节表示，因为4个字节能表达的长度为4294967295，已经完全够用，因此直接将前面4个字节置0
            head.writeUInt32BE(0, 2);
            head.writeUInt32BE(size, 6);
        } else if (size > 125) {
            head[1] = 126;
            // 长度超过125的话就由2个字节表示
            head.writeUInt16BE(size, 2);
        } else {
            head[1] = size;
        };
        return Buffer.concat([head, body], size + head.length);
    },
    unstat: (body) => {
        let data, size, offset = 2; //数据索引，因为第一个字节和第二个字节肯定不为数据，所以初始值为2
        let byte = body[1]; //代表masked位和可能是payloadLength位的第二个字节
        let hasmask = byte >= 128; //如果大于或等于128，说明masked位为1
        byte -= hasmask ? 128 : 0; //如果有掩码，需要将掩码那一位去掉
        //如果为126，则后面16位长的数据为数据长度，如果为127，则后面64位长的数据为数据长度
        if (byte == 126) {
            offset += 2;
            size = body.readUInt16BE(2);
        } else if (byte == 127) {
            offset += 8;
            size = body.readUInt32BE(2) + body.readUInt32BE(6);
        } else {
            size = byte;
        };
        //如果有掩码，则获取32位的二进制masking key，同时更新index
        if (hasmask) {
            data = body.slice(offset, offset + 4);
            offset += 4;
        };
        //获取第一个字节的opcode位 8连接关闭 9 ping10 pong
        return {
            offset: offset,
            body: data,
            opcode: body[0].toString(16).split("")[1]
        };
    },
    unwrap: (body) => {
        let data, stat = utils.unstat(body);
        if (stat.body && stat.opcode == 1) {
            data = new Buffer(body.length - stat.offset);
            for (var i = stat.offset, j = 0; i < body.length; i++, j++) {
                //对每个字节进行异或运算，masked是4个字节，所以%4，借此循环
                data[j] = body[i] ^ stat.body[j % 4];
            };
        };
        return data;
    },
    bindWebSocke: (sock) => {
        sock.on('data', (buffer) => {
            let data = utils.unwrap(buffer);
            if (data) {
                data = JSON.parse(data.toString());
                if (data.command == "IMG") {
                    // fs.createReadStream("./audio/a.mp3").on('data', (bytes) => {
                    //     sock.emit('send', utils.wrap(bytes, true));
                    // })
                    fs.readFile("./audio/a.mp3", function(err, bytes) {
                        if (err) throw err;
                        sock.emit('send', utils.wrap(bytes, true));
                    });
                } else if (data.command == "VIDEO") {
                    fs.createReadStream("./audio/frag.mp4").on('data', (bytes) => {
                        sock.emit('send', utils.wrap(bytes, true));
                    })
                } else {
                    sock.emit('send', utils.wrap(new Buffer("服务端接收到数据")));
                }
            };
        }).on('close', () => {
            console.log('socket close');
        }).on('end', () => {
            console.log('socket end');
        }).on('send', (buf) => { //自定义事件
            sock.write(buf);
        });
    },
    WebSocketHead: (req, sock) => {
        let output = [];
        let head = req.headers;
        let shakey = crypto.createHash('sha1').update(head["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest('base64');
        output.push(
            "HTTP/1.1 101 Switching Protocols",
            "Server:Nxiao",
            "Upgrade:WebSocket",
            "Connection:Upgrade",
            "Sec-WebSocket-Accept:" + shakey + "\r\n\r\n"
        );
        sock.write(output.join('\r\n'));
    }
};
const server = http.createServer();
server.on('error', (err) => {
    if (err.code == 'EADDRINUSE') {
        console.log('服务端口被占用');
    };
}).on('connection', (s) => {
    console.log('新链接');
}).on('request', (req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    console.log(pathname.indexOf(".html"));
    if (pathname.indexOf(".html") != -1) {
        res.writeHead(200, {
            'Content-Type': "text/html;charset=utf-8"
        });
        fs.createReadStream("." + pathname).pipe(res);
    } else {
        res.writeHead(404);
        res.end();
    }

    // if (!req.upgrade) { // 非upgrade请求选择：中断或提供普通网页
    //     res.writeHead(200, { 'content-type': 'text/plain' });
    //     res.write('WebSocket server works!');
    // };
    // res.end();
}).on('upgrade', (req, sock, head) => {
    if (req.headers.upgrade.toLowerCase() !== 'websocket') {
        console.warn('非法连接');
        sock.end();
        return;
    };
    try {
        utils.bindWebSocke(sock);
        utils.WebSocketHead(req, sock);
    } catch (e) {
        sock.end();
    };
}).listen(utils.port);