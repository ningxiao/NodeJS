const mapreduce = require('./main')(2);//启动核数
const information = require('./data.json');
const MapOperator = (key, value) => {
    const aux = {};
    const list = [];
    value.split(' ').forEach(key => {
        aux[key] = (aux[key] || 0) + 1;
    });
    for (const key in aux) {
        list.push([key, aux[key]]);
    }
    return list;
};
const ReduceOperator = (key, values) => {
    let total = 0;
    values.forEach((count) => {
        total += count;
    });
    return total;
};
/**
 * 统计data.json单词出现数量
 * 1、运行node createData.js 创建列表 ”修改createData.js 文件变量 let i = 10; 控制数据源量级“
 * 2、运行node tests.js 执行运行
 */
console.time('整体耗时');
mapreduce(information, MapOperator, ReduceOperator, result => {
    console.timeEnd('整体耗时');
    console.log(result);
});