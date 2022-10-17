import mri from 'mri';
import {
    mkdir
} from 'node:fs/promises';
import cluster from 'node:cluster';
import mapreduce from './main.js';
import createSplit from './createSplit.js';
const argv = process.argv.slice(2);
const goods = ['阳光', '开心', '乐天派'];
const bads = ['fuck', '嘲笑', '堕落', '时运不济'];
const operatorMap = {
    all: {
        doc: '单词汇总统计',
        map: (key, value) => {
            const aux = {};
            const list = [];
            value.split(' ').forEach(key => {
                aux[key] = (aux[key] || 0) + 1;
            });
            for (const key in aux) {
                list.push([key, aux[key]]);
            }
            return list;
        },
        reduce: (key, values) => {
            return values.reduce((total, count) => {
                return total + count;
            }, 0);
        }
    },
    good: {
        doc: '褒义单词汇总统计',
        map: (key, value) => {
            const aux = {};
            const list = [];
            value.split(' ').forEach(key => {
                if (goods.includes(key)) { //查找正向词
                    aux[key] = (aux[key] || 0) + 1;
                }
            });
            for (const key in aux) {
                list.push([key, aux[key]]);
            }
            return list;
        },
        reduce: (key, values) => {
            let total = 0;
            values.forEach((count) => {
                total += count;
            });
            return total;
        }
    },
    bad: {
        doc: '贬义单词汇总统计',
        map: (key, value) => {
            const aux = {};
            const list = [];
            value.split(' ').forEach(key => {
                if (bads.includes(key)) { //查找反向清晰词
                    aux[key] = (aux[key] || 0) + 1;
                }
            });
            for (const key in aux) {
                list.push([key, aux[key]]);
            }
            return list;
        },
        reduce: (key, values) => {
            return values.reduce((total, count) => {
                return total + count;
            });
        }
    }
}
const {
    cores,
    total,
    group
} = mri(argv, {
    default: {
        cores: 2,
        total: 10,
        group: 'all'
    }
});
const { doc, map, reduce } = operatorMap[group];
/**
 * MapReduce 小示例
 * cores 子进程数量
 * total Mock数据量级
 * group 执行任务类型 all（单词出现次数） good（正向单词出现次数）bad（负面单词出现次数）
 * node tests.js --cores=2 --total=200 --group=bad
 * 启动两个进行对（2*200*37）条数据进行负面单词统计并输出
 */
if (cluster.isPrimary) { // 主进程执行任务
    try {
        console.time('Mock数据耗时');
        await mkdir(new URL('./splits/',
            import.meta.url), {
            recursive: true
        });
        for (let i = 0; i < cores; i++) {
            await createSplit(i, total);
        }
        console.timeEnd('Mock数据耗时');
        console.warn('---------开始执行---------');
    } catch (err) {
        console.error(err.message);
    }
    console.time('任务耗时');
}
//启动核数
mapreduce(cores)(map, reduce, data => {
    console.timeEnd('任务耗时');
    console.warn('---------开始结束---------');
    console.log(doc);
    console.table(data);
});