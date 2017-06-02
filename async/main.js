const fs = require('fs');
const url = require('url');
const path = require('path');
const https = require('https');
let moviedir = __dirname + '/movies';
let exts = ['.mkv', '.avi', '.mp4', '.rm', '.rmvb', '.wmv'];
// 获取海报
let getPoster = (movieName) => {
    let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`;
    return new Promise(function(resolve, reject) {
        https.get(url, (res) => {
            let body = '';
            if (res.statusCode == 200) {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.once('end', () => {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        body = {
                            subjects: [{ images: { large: "http://box5.bfimg.com/img/57/96057/51_180*250.jpg" } }],
                        };
                    };
                    resolve(body.subjects[0].images.large);
                });
            } else {
                res.resume();
                resolve("https://g3.ykimg.com/051600005768E31767BC3C120C01224D");
            };
        }).once('error', (err) => {
            resolve("https://g3.ykimg.com/051600005768E31767BC3C120C01224D");
        });
    });
};
// 保存海报
let savePoster = (movieName, src) => {
    let req, body = JSON.stringify("get img");
    let options = {
        host: url.parse(src).host,
        port: 443,
        method: 'GET',
        path: url.parse(src).pathname,
        headers: {
            'Cookie': 'locale=zh_CN',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Length': body.length
        }
    };
    req = https.request(options, (res) => {
        res.pipe(fs.createWriteStream(path.join(moviedir, movieName + '.jpg')));
    });
    req.write(body);
    //获取视频文件大小
    req.once('response', function(res) {
        console.log(`${movieName}.jpg大小为` + res.headers['content-length']);
    });
    req.once('error', function(err) {
        req.end();
        console.log(err);
    });
    req.end();
    //request.get(url).pipe(fs.createWriteStream(path.join(moviedir, movieName + '.jpg')));
};
(async() => {
    let name;
    let list = await new Promise((resolve, reject) => { //异步读取文件列表转为代码同步编程
        fs.readdir(moviedir, (err, list) => {
            resolve(list.filter((v) => exts.includes(path.parse(v).ext)));
        });
    });
    // await只能使用在原生语法
    for (let key of list) {
        name = path.parse(key).name;
        console.log(`正在获取【${name}】的海报`);
        savePoster(name, await getPoster(name));
        console.log(`获取【${name}】的海报完成`);
    };
    console.log('=== 全部任务完成 ===');
})();