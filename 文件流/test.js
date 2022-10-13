const fs = require('fs');
const path = require('path');
const group = require('./group');
const assert = require('assert');
const MemoryStrea = require('./MemoryStrea');
const CountStream = require('./countstream');
const exampleStream = new CountStream('兰亭');
const testData = '世事无常,兰亭已已';
process.st
const args = {
    '-h': () => {
        console.log('展示帮助:', args);
    },
    '-r': (file) => {
        if (file && file.length) {
            console.log('Reading', file);
            fs.createReadStream(file).pipe(process.stdout);
        } else { // 读取错误返回错误码 echo $? 读取错误码
            console.error('文件读取错误');
            process.exit(1);
        }
    },
    '-s': () => {
        console.log(path.join(__dirname, 'test.js'), __filename);
        console.log(process.memoryUsage());
    },
    '-t': () => {
        exampleStream.on('total', count => {
            assert.equal(group.one(), 'one');
            assert.equal(group.two(), 'two');
            assert.equal(count, 3);// 匹配文件出现兰亭次数供给三次
            passed = '通过';
        });
        fs.createReadStream(__filename).pipe(exampleStream);
    }, '-k': (pid) => {// 给指定进程发送通知
        process.kill(pid, 'SIGHUP');
    }, '-o': () => {
        const memoryStream = new MemoryStrea();
        memoryStream.on('readable', () => {//数据准备好了可以开始读取
            const output = memoryStream.read();
            console.log('Type: %s, value: %j', typeof output, output);
        });
    }
};
let passed = '不通过';
process.on('exit', () => {
    console.log('测试用例:', passed);
});
if (process.argv.length > 0) {
    process.argv.forEach((key, index) => {
        let callback = args[key];
        if (callback) {
            callback(...process.argv.slice(index + 1));
        }
    });
}
