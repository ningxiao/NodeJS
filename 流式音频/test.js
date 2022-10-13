const os = require('os');
const fs = require('fs');
const path = require('path');
const readStream = fs.createReadStream(path.join(__dirname,'audio/frag.mp4'));
const writeStream = fs.createWriteStream(path.join(__dirname,'audio/copy_frag.mp4'))
let n = 0;
readStream.on('data',(chunk)=>{
    n++;
    //console.log('data emits');
    //console.log(Buffer.isBuffer(chunk),Buffer.byteLength(chunk));
    if(writeStream.write(chunk) === false){//防止读取文件填满内存
        console.log('数据未写入暂停读取');
        readStream.pause();//暂停流
    }
}).on('readable',()=>{
    console.log('data readable');
}).on('end',()=>{
    console.log('数据读取完成',n);
    const Readable = require('stream').Readable;
    const Writable = require('stream').Writable;
    const RStream = new Readable();
    const WStream = new Writable();
    RStream.push('I ');
    RStream.push('Love');
    RStream.push('Imooc\n');
    RStream.push(null);
    WStream._write = (chunk,encode,cb)=>{
        console.log(chunk.toString());
        cb();
    }
    RStream.pipe(WStream);
}).on('close',()=>{
    console.log('流读取关闭');
}).on('error',(err)=>{
    console.log(`流读异常${err}`);
});
writeStream.on('drain',()=>{
    console.log('数据写入成功恢复读取');
    readStream.resume();//恢复流
});