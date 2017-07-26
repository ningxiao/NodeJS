"use strict";
/**
 *
 * 2015.10.31 07:53
 * 实验使用node5创建http请求
 *
 **/
const EventEmitter = require('events');
const util = require('util');
const fs = require('fs');
const net = require('net');
const url = require('url');
const http = require('http');
const zlib = require("zlib");
const path = require('path');
const mimemap = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html;charset=utf-8",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "application/x-javascript;charset=utf-8",
    "json": "application/json;charset=utf-8",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "mp3": "audio/mpeg ",
    "mp4": "video/mp4",
    "ogg": "application/ogg",
    "m4a": "audio/x-m4a",
    "mp4": "video/mp4",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml",
    "flv": "flv-application/octet-stream",
    "appcache": "text/cache-manifest",
    "manifest": "text/cache-manifest"
};
const PORT = 8080;
const HOST = '127.0.0.1';
const defmap = {
    "/": "/index.html"
};
const dirname = path.dirname(__dirname);
const iszip = /^(htm|html|js|css)$/ig;
const code = ["请求参数不全!", "请求文件不存在!", "文件损坏!", "当前是目录!"];
const utils = {
    httpfail: (buf, req, res) => {
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(buf),
            'Content-Type': 'text/plain;charset=utf-8'
        });
        res.write(buf);
        res.end();
        req.socket.end();
    },
    httpsuccess: (file, req, res) => {
        fs.stat(file, function(err, stats) {
            let head, zlibs, encoding, extname, contenttype;
            if (err) {
                utils.httpfail(code[2], res);
                return;
            };
            extname = path.extname(file).slice(1);
            contenttype = mimemap[extname] || "text/plain;charset=utf-8";
            encoding = req.headers['accept-encoding'] || "";
            if (extname.match(iszip) && encoding) {
                if (encoding.match(/\bgzip\b/)) {
                    zlibs = zlib.createGzip();
                    head = {
                        'content-encoding': 'gzip',
                        'Content-Type': contenttype
                    };
                } else if (encoding.match(/\bdeflate\b/)) {
                    zlibs = zlib.createDeflate();
                    head = {
                        'content-encoding': 'deflate',
                        'Content-Type': contenttype
                    };
                };
            } else {
                res.writeHead(200, {
                    'Content-Length': stats.size,
                    'Content-Type': contenttype
                });
                fs.createReadStream(file).pipe(res);
                return;
            };
            res.writeHead(200, head);
            fs.createReadStream(file).pipe(zlibs).pipe(res);
        });
    },
    mysql: (data, success) => {
        let calldata = (buf) => {
            utils.socket.removeListener('error', callfailure);
            success(buf);
        };
        let callfailure = (buf) => {
            utils.socket.removeListener('data', calldata);
            success('没有内存数据');
        };
        if (utils.socket) {
            utils.socket.once('data', calldata);
            utils.socket.once('error', callfailure);
            utils.socket.write(data);
        } else {
            success('没有内存数据');
        };
    }
};
utils.socket = new net.Socket().once('close', () => {
    utils.socket = null;
}).on('error', () => {
    utils.socket.destroy();
    utils.socket = null;
}).connect(PORT, HOST);
const routing = {
    "/getuid": function(req, res) {
        let body = url.parse(req.url, true);
        let query = body.query;
        let uid = query["uid"];
        let callback = (buf) => {
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(buf),
                'Content-Type': 'text/plain;charset=utf-8'
            });
            res.write(buf);
            res.end();
            req.socket.end();

        };
        if (uid) {
            utils.mysql(JSON.stringify({
                head: 'GET:UID',
                body: {
                    uid: uid,
                    pid: process.pid
                }
            }), callback);
        } else {
            callback("请传入查询UID");
        };
    },
    "/cookie": function(req, res) {
        let buf, body = url.parse(req.url, true);
        let query = body.query;
        let cookies = {};
        req.headers.cookie && req.headers.cookie.split(';').forEach((cookie) => {
            let parts = cookie.split('=');
            cookies[parts[0].trim()] = (parts[1] || '').trim();
        });
        buf = JSON.stringify(cookies);

        function cookie(name, value, expires, path, domain) {
            let today, new_date, expiresDate, cookie = name + '=' + value + ';';
            if (expires != undefined) { //cookie有效期时间
                today = new Date();
                new_date = new Date(today.getTime() + parseInt(expires) * 1000);
                expiresDate = new_date.toGMTString(); //转换成 GMT 格式。
                cookie += 'Expires=' + expiresDate + ';';
            };
            if (path != undefined) { //目录
                cookie += 'Path=' + path + ';';
            };
            if (domain != undefined) { //域名
                cookie += 'Domain=' + domain + ';';
            };
            return cookie;
        };
        res.writeHead(200, {
            'Set-Cookie': cookie("bfuname", "", -999, "/", ".baofeng.com"),
            'Content-Length': Buffer.byteLength(buf),
            'Content-Type': 'text/plain;charset=utf-8'
        });
        res.write(buf);
        res.end();
        req.socket.end();
    },
    "/lottery/eventLottery": (req, res) => {
        let body = url.parse(req.url, true);
        let query = body.query;
        let bfcsid = query["bfcsid"];
        let buf = JSON.stringify({ "status": false, "msg": "未中奖", "code": 10005, "data": { "is_vip": 1, "event_end_days": 230 } });
        if (bfcsid) {
            buf = JSON.stringify({ "status": false, "msg": "未中奖", "code": 10032, "data": { "prize_id": 57, "draw_rest": 230 } });
        };
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(buf),
            'Content-Type': 'text/plain;charset=utf-8'
        });
        res.write(buf);
        res.end();
        req.socket.end();
    },
};
const server = http.createServer((req, res) => {
    let host, body = url.parse(req.url, true);
    let query = body.query;
    let pathname = body.pathname;
    res.setHeader("Server", "Nxiao/V5");
    if (pathname in routing) {
        routing[pathname](req, res);
    } else {
        if (pathname.slice(-1) === "/") {
            pathname = defmap["/"];
        };
        pathname = dirname + pathname;
        fs.stat(pathname, (err, stats) => {
            if (!err) {
                if (stats.isDirectory()) { //当前是一个目录
                    utils.httpfail(code[3], req, res);
                    return;
                };
                utils.httpsuccess(pathname, req, res);
                return;
            };
            utils.httpfail(code[1], req, res);
        });
    };
}).on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
process.on("message", function(msg, socket) {
    process.nextTick(function() {
        if (msg == 'socket' && socket) {
            //触发http模块的connection事件将socket连接
            server.emit("connection", socket);
        };
    });
});