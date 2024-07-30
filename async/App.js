"use strict";
/**
 *
 * 2015.10.31 07:53
 * 实验使用node5创建http请求
 *
 **/
const fs = require('fs');
const os = require('os');
const net = require('net');
const url = require('url');
const http = require('http');
const zlib = require("zlib");
const path = require('path');
const cluster = require('cluster');
const HOST = '127.0.0.1';
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
const cache = {}
const dirname = path.join(__dirname, 'www');
const templpath = path.join(__dirname, 'src/js/src/template');
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
const redis = {
    get: (pid) => {
        return new Promise((resolve, reject) => {
            let callback = (er) => {
                resolve("xx1-xxs4sd-ssd4-xs4ds");
            };
            client.once('data', (data) => {
                client.removeListener('error', callback);
                resolve(data);
            });
            client.once('error', callback);
            client.write(`编号${pid}工作进程`);
        });
    }
}
const routing = {
    "/sign": async(request, response) => {
        let context = url.parse(request.url, true).query;
        let body = `{
            "name": "nxiao",
            "sign": "${ await redis.get(process.pid)}"
        }`;
        response.writeHead(200, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'text/plain;charset=utf-8'
        });
        response.write(body);
        response.end();
    }
};
const port = 80;
const client = net.createConnection(3000, HOST);
client.on('connect', () => {
    console.log('客户端：已经与服务端建立连接');
});
client.on('close', (data) => {
    console.log('客户端：连接断开');
});
client.on('error', (er) => {
    console.log('客户端异常' + er.message);
});
const httpserver = http.createServer((req, res) => {
    let host, body = url.parse(req.url, true);
    let query = body.query;
    let pathname = body.pathname;
    res.setHeader("Server", "Nxiao/V5");
    if (path.normalize(decodeURI(req.url)) !== decodeURI(req.url)) {
        res.statusCode = 403;
        res.end();
        return;
    }
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
        pathname = path.join(dirname, pathname);
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
    process.on('exit', (error) => {
        console.log("服务器退出");
    });
    /**
     * 监听异常退出输出日志
     **/
    process.on('uncaughtException', (error) => {
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