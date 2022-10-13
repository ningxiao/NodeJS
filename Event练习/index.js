const https = require('https');
const events = require('events');
const domain = require('domain').create();
domain.on('error', err => {
    console.log('请求发生异常', err);
})
class EventTraceker extends events {
    constructor() {
        super();
        this._url;
        this.buffers = [];
    }
    static get HTTP_EDN() {
        return 'http_end';
    }
    set url(url) {
        this._url = url;
    }
    send() {
        if (this._url) {
            https.get(this._url, (res) => {
                res.on('data', (chunk) => {
                    this.buffers.push(chunk);
                    console.log(`Received ${chunk.length} bytes of data.`);
                });
                res.once('end', () => {
                    this.emit(EventTraceker.HTTP_EDN,Buffer.concat(this.buffers));
                });
            });
        }
    }
}
domain.run(() => {
    const testEvent = new EventTraceker();
    testEvent.on('newListener', (ev, listener) => {
        console.log('添加新事件', ev);
    });
    testEvent.on(EventTraceker.HTTP_EDN, buf => {
        console.log('http请求成功',buf.toString());
    });
    testEvent.url = 'https://www.baidu.com';
    testEvent.send();
});
