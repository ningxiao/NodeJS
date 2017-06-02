"use strict";
const fs = require('fs');
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
router.get('/', async(ctx, next) => {
    await next();
    ctx.response.type = 'text/html;charset=utf-8';
    ctx.response.body = fs.createReadStream("view/play.ejs");
});
router.get('/users/:id', async(ctx, next) => {
    let id = ctx.params.id || 0;
    await next();
    console.log(id);
    ctx.response.type = 'application/json;charset=utf-8';
    ctx.response.body = `{"id":"${ctx.params.id}","name":"nxiao","age":30}`;
});
app.use(router.routes()).use(router.allowedMethods());
app.on('error', (err) => {
    console.log('server error', err);
});
app.listen(80);

/**
 * 接收主进程对子进程的通知
 * @param  {object} head 通知消息头;
 * @return null;
 */
process.on('message', function(msg) {
    switch (msg.head) {
        case 'set action':
            console.log(msg.body);
            break;
        default:
    }
});
/**
 * 监听服务器异常退出
 * @param  {object} err 退出异常信息
 * @return null
 */
process.on('exit', function(err) {
    console.log("服务器退出");
});
/**
 * 监听服务器uncaughtException退出
 * @param  {object} err 退出异常信息
 * @return null
 */
process.on('uncaughtException', function(err) {
    console.log(err.toString());
});
module.exports = app;