setTimeout(() => {
    console.log('-----------timer1----------');
    Promise.resolve().then(() => {
        console.log('-----------Promise1----------');
    });
}, 0);
setTimeout(() => {
    console.log('-----------timer2----------');
    Promise.resolve().then(() => {
        console.log('-----------Promise2----------');
    });
}, 0);
/* 
 * 简单说,process.nextTick是在当前代码执行完毕后立即执行,setImmediate是加入到轮询,空闲后立即执行.
 * 测试结论:
 * process.nextTick >> setTimeout(handler,0) , setImmediate >> setTimeout(handler, n)
*/
setImmediate(() => {
    console.log('-----------setImmediate----------');
});
process.nextTick(() => {
    console.log('-----------process.nextTick----------');
});
/**
 * Node10结果 timer1->timer2->Promise1->Promise2
 * Node11结果 timer1->Promise1->timer2->Promise2
 * 浏览器结果 timer1->Promise1->timer2->Promise2
 */
