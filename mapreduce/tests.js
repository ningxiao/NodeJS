const mapreduce = require('./main')(4);
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
console.time('整体耗时');
mapreduce(information, MapOperator, ReduceOperator, result => {
    console.timeEnd('整体耗时');
    console.log(result);
});