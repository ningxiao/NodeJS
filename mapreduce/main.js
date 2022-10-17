import {
    cpus
} from 'node:os';
import {
    createReadStream
} from 'node:fs';
import cluster from 'node:cluster';
import process from 'node:process';
import * as readline from 'node:readline';
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
export default (cores = cpus().length) => {
    return (map, reduce, callback) => {
        if (cluster.isPrimary) { // 主进程执行代码逻辑区
            let finished = 0;
            const results = [];
            const masterTim = [Number.MAX_VALUE, Number.MIN_VALUE];
            for (let i = 0; i < cores; i++) {
                const worker = cluster.fork();
                worker.on('message', msg => {
                    const {
                        about,
                        workerTim
                    } = msg;
                    if (about == 'mapFinish') {
                        results.push(...msg.result);
                        masterTim[0] = Math.min(masterTim[0], workerTim[0]);
                        masterTim[1] = Math.max(masterTim[1], workerTim[1]);
                    }
                });
            }
            cluster.on('exit', () => {
                finished++;
                if (finished === cores) { // 执行完成，进行数据整合。
                    const groups = resultReduce(results);
                    for (const key in groups) {
                        groups[key] = reduce(key, groups[key]);
                    };
                    console.log('总耗时: %dms', masterTim[1] - masterTim[0]);
                    callback(groups);
                }
            });
        } else if (cluster.isWorker) { // 子进程执行代码逻辑区
            const result = [];
            const tid = Date.now();
            const intermediate = [];
            const id = cluster.worker.id;
            const splitName = `split${id - 1}`;
            let used = process.memoryUsage().heapUsed / 1048576; // 字节转MB 1024*1024
            console.log(`进程${id}->初始${used.toFixed(2)} MB`);
            console.time(`进程${id}->计算耗时`);
            console.log(`进程${id}->Map`);
            const rl = readline.createInterface({
                crlfDelay: Infinity,
                input: createReadStream(`./splits/${splitName}.log`)
            });
            rl.on('line', vo => { // 读取一行数据
                const [key, value] = JSON.parse(vo);
                intermediate.push(...map(key, value));
            });
            rl.once('close', () => {
                console.log(`进程${id}->Reduce`);
                const groups = resultReduce(intermediate);
                for (const key in groups) {
                    result.push([key, reduce(key, groups[key])]);
                }
                // 计算结果返回主进程
                process.send({
                    about: 'mapFinish',
                    result:result.sort(),
                    workerTim: [tid, Date.now()]
                });
                used = process.memoryUsage().heapUsed / 1048576; // 字节转MB 1024*1024
                console.log(`进程${id}->结束${used.toFixed(2)} MB`);
                console.timeEnd(`进程${id}->计算耗时`);
                cluster.worker.destroy();                // 关闭当前子进程
            });
        }
    }
};