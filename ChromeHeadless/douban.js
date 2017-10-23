const fs = require('fs');
const url = require('url');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer');
const moviedir = __dirname + '/movies';
let saveposter = (data) => {
    let req;
    let options = {
        host: url.parse(data.img).host,
        port: 443,
        method: 'GET',
        path: url.parse(data.img).pathname,
        headers: {
            'Cookie': 'locale=zh_CN',
            'Accept-Encoding': 'gzip, deflate'
        }
    };
    req = https.request(options, (res) => {
        console.log(path.join(moviedir, data.title + '.webp'));
        res.pipe(fs.createWriteStream(path.join(moviedir, data.id + '.webp')));
    });
    //获取视频文件大小
    req.once('response', function(res) {
        console.log(`${data.title}.webp大小为 ${res.headers['content-length']}`);
    });
    req.once('error', function(err) {
        req.end();
        console.log(err);
    });
    req.end();
};
(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    /*
        page.on('request', (request) => {
            if (request.url.indexOf("douban.js") != -1) {
                console.log(request.headers);
            };
        });
    */
    /*
        page.on('response', async(response) => {
            if (response.url.indexOf("feed.php") != -1) {
                //console.log(request.headers);
                await fs.createWriteStream(path.join(moviedir, 'douban.js')).write(await response.text());
                await page.screenshot({
                    path: 'douban.png',
                    fullPage: true
                });
                await browser.close();
            };
        });
    */
    await page.setViewport({
        width: 1440,
        height: 1000
    });
    await page.goto('https://movie.douban.com/');
    //await page.goto('http://iflow.minfo.baofeng.net/index.html?debug=1#/click/-1');
    await page.screenshot({
        path: 'douban.png',
        fullPage: true
    });
    let list = await page.evaluate(() => {
        return [...document.querySelectorAll('li[data-title]')].map(el => {
            return {
                id: el.getAttribute("data-rater"),
                href: el.querySelector("a").href,
                img: el.querySelector("img").src,
                title: el.getAttribute("data-title")
            }
        })
    });
    //list.map(saveposter);
    await browser.close();
})();