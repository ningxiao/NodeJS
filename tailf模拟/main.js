const fs = require('fs');
const tailf = (name, onError, write) => {
    const CHUNK_SIZE = 16 * 1024;
    fs.open(name, 'r', (err, fd) => {//只读模式获取文件句柄
        if (err) return onError(err);
        fs.fstat(fd, (err, stats) => {//获取文件相关信息例如文件大小
            if (err) return onError(err);
            let position = stats.size;
            const loop = () => {
                const buf = new Buffer(CHUNK_SIZE);
                //每次读取文件块大小，16K
                fs.read(fd, buf, 0, CHUNK_SIZE, position, (err, bytesRead, buf) => {
                    if (err) return onError(err);
                    // 实际读取的内容长度以 bytesRead 为准，并且更新 position 位置
                    position += bytesRead;
                    //切片数据
                    write(buf.slice(0, bytesRead).toString());
                    //当读取的数据大于或者等说明可能存在数据需要再次调用打印
                    if (bytesRead >= CHUNK_SIZE) {
                        loop();
                    };
                });
            };
            loop();
            // 监听文件变化，如果收到 change 事件则尝试读取文件内容
            fs.watch(name, (event, name) => {
                if (event === 'change') {
                    loop();
                }
            });
        });
    });
}
const name = process.argv[2];
if (name) {
    tailf(name, 100, err => {
        if (err) console.error(err);
    }, data => {
        process.stdout.write(data);
    });
} else {
    console.log('使用方法： node tailf <文件名>');
}