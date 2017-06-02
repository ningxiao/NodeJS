"use strict";
/**
 *
 * 2015.10.31 07:53
 * 实验使用node5创建http请求
 *
 **/
const fs = require('fs');
const os = require('os');
const url = require('url');
const http = require('http');
const zlib = require("zlib");
const path = require('path');
const cluster = require('cluster');
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
const defmap = {
    "/": "/index.html"
};
const iszip = /^(htm|html|js|css)$/ig;
const rulemap = {
    "static.hd.baofeng.com": /\_(.[\d_]+?)\./ig
};
const code = ["请求参数不全!", "请求文件不存在!", "文件损坏!", "当前是目录!"];
const utils = {
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
    rulefile: (url, host) => {
        if (url.indexOf(".js") != -1 || url.indexOf(".css") != -1) {
            return url.replace(rulemap[host], ".");
        };
        return url;
    },
    httpfail: (buf, req, res) => {
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(buf),
            'Content-Type': 'text/plain;charset=utf-8'
        });
        res.write(buf);
        res.end();
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
    }
};
const routing = {
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
    },
    "/msg": (req, res) => { //使用http推送协议
        let tid, poll = () => {
            res.write("event: add\n\n" + "data: " + JSON.stringify({
                "username": "bobby",
                "time": Date.now()
            }) + "\r");
            tid = setTimeout(poll, 1000);
        };
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache"); // 建议不要缓存SSE数据
        res.setHeader("Connection", "keep-alive");
        //获取当前socket连接实例判断浏览器是否断开
        req.connection.once("close", function() {
            console.log("浏览器断开");
            clearTimeout(tid);
        }, false);
        tid = setTimeout(poll, 1000);
    }
};
let httpserver, port = 80;
httpserver = http.createServer((req, res) => {
    let host, body = url.parse(req.url, true);
    let query = body.query;
    let pathname = body.pathname;
    res.setHeader("Server", "Nxiao/V5");
    if (pathname in routing) {
        routing[pathname](req, res);
    } else {
        host = req.headers.host;
        if (host in rulemap) {
            pathname = utils.rulefile(pathname, host);
        };
        if (pathname.slice(-1) === "/") {
            pathname = defmap["/"];
        };
        pathname = __dirname + pathname;
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
})
if (cluster.isMaster) {
    let cpus = os.cpus().length;
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    };
    cluster.on('exit', (worker, code, signal) => {
        console.log('[master] ' + 'exit worker' + worker.id + ' died');
    });
} else {
    /**
     * 退出输出日志
     **/
    process.on('exit', function(error) {
        console.log("服务器退出");
    });
    /**
     * 监听异常退出输出日志
     **/
    process.on('uncaughtException', function(error) {
        console.log(error.toString());
    });
    ((argv) => {
        if (argv.length == 1) {
            port = argv[0];
        }
        httpserver.on('error', (err) => {
            if (err.code == 'EADDRINUSE') {
                console.log('服务端口被占用');
            };
        });
        console.log(utils.ip(), '--', process.pid);
        httpserver.listen(port);
    })(process.argv.slice(2));
};