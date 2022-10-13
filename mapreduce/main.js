const cluster = require('cluster');
const cpus = require('os').cpus().length;
const resultReduce = (result) => {
    return result.reduce((previousValue, currentValue) => {
        const [key, count] = currentValue;
        if (!Reflect.has(previousValue, key)) {
            previousValue[key] = [];
        }
        previousValue[key].push(count);
        return previousValue;
    }, {});
}
/**
 * 
 * @param {number} cores  任务核心数可以指定，默认当前平台CPU核总数
 * @returns  返回一个执行算子 
 */
module.exports = (cores = cpus) => {
    return (splits, mapOperator, reduceOperator, callback) => {
        const splitSize = splits.length;
        const step = Math.ceil(splitSize / cores);
        if (cluster.isPrimary) { // 主进程执行代码逻辑区
            let finished = 0;
            const results = [];
            const tims = [Number.MAX_VALUE, Number.MIN_VALUE];
            for (let i = 0; i < cores; i++) {
                const start = i * step;
                if (start < splitSize) {
                    const worker = cluster.fork();
                    worker.on('message', msg => {
                        if (msg.about == 'mapFinish') {
                            results.push(...msg.result);
                            tims[0] = Math.min(tims[0], msg.tims[0]);
                            tims[1] = Math.max(tims[1], msg.tims[1]);
                        }
                    });
                }
            }
            cluster.on('exit', (worker) => {
                finished++;
                if (finished === cores) { // 执行完成，进行数据整合。
                    const groups = resultReduce(results);
                    for (const key in groups) {
                        groups[key] = reduceOperator(key, groups[key]);
                    };
                    console.log('计算耗时: %dms', tims[1] - tims[0]);
                    callback(groups);
                }
            });
        } else if (cluster.isWorker) { // 子进程执行代码逻辑区
            const result = [];
            const id = process.pid;
            const tid = Date.now();
            const intermediate = [];
            const index = cluster.worker.id - 1;
            console.time(`子进程#${id}：计算耗时`);
            const {
                start,
                end
            } = {
                start: index * step,
                end: Math.min(index * step + step, splitSize)
            };
            console.log(`子进程#${id}：执行Map`);
            splits.slice(start, end).forEach((split) => {
                const [key, value] = split;
                intermediate.push(...mapOperator(key, value));
            });
            console.log(`子进程#${id}：执行Reduce`);
            const groups = resultReduce(intermediate);
            for (const key in groups) {
                result.push([key, reduceOperator(key, groups[key])]);
            }
            console.log(`子进程#${id}：MapReduce结束`);
            // 计算结果返回主进程
            process.send({
                id,
                result,
                about: 'mapFinish',
                tims: [tid, Date.now()]
            });
            console.timeEnd(`子进程#${id}：计算耗时`);
            // 关闭当前子进程
            cluster.worker.destroy();
        }
    }
};