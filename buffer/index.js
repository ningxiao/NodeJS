// 设计自己的二进制协议
/**
 * ['数据库索引','存入列',...自定义长度数据]
 */
const key = 0; // 存储列key
const dbIndex = 0x9; //存储索引
const zlib = require('zlib');
const bitmaks = [1, 2, 4, 8, 16, 32, 64, 128];
const dataBase = [[], [], [], [], [], [], [], []];
const store = buf => {
    let db = buf[0];
    let key = buf.readInt8(1);
    if (buf[2] === 0x78) {
        zlib.inflate(buf.slice(2), (err, inflatedBuf) => {
            if (err) return console.error(err);
            let data = inflatedBuf.toString();
            bitmaks.forEach((bitmak, index) => {// 写入0 到3位
                if ((db & bitmak) === bitmak) {
                    dataBase[index][key] = data;
                }
            });
            console.log('updated db', dataBase);
        });
    }
}
zlib.deflate('{"name":"马晓伟"}', (err, deflateBuf) => {
    store(Buffer.concat([Buffer.from(new Uint8Array([dbIndex, key])), deflateBuf]));
})