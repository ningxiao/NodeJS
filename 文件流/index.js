const CountStream = require('./countstream');
const bookStream = new CountStream('baidu');
const https = require('https');
https.get('https://www.baidu.com', (res) => {
    res.pipe(bookStream);
});
bookStream.on('total', (count) => {
    console.log('统计baidu出现次数:', count);
});
process.stdin.resume();// 阻止退出
process.on('SIGHUP', () => { // 监听HUP事件 传入 kill -HUP 10412 通知
    console.log('触发SIGHUP事件');
});
console.log('PID', process.pid);
