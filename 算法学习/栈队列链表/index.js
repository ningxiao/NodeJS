/** 
 * 计算QQ号 使用队列
 * 规则将第一个数删除第二个数放入数字串末尾依次类推直到剩余最后一个数将最后一个数删除
 * 结果 631758924 转为 615947283
*/
const sumQQ = () => {
    const qqs = [6, 3, 1, 7, 5, 8, 9, 2, 4];
    let head = 0;
    let tail = qqs.length;
    while (head < tail) {
        console.log(qqs[head]);
        head++;
        qqs.push(qqs[head]);
        tail++;
        head++;
    }
}
const stack = () => {
    const name = '明月几时有？把酒问青天';
    const list = [];
    let count = 0;
    // 写入栈
    for (let char of name) {
        list[count] = char;
        count++;
    };
    // 读取栈 后入先出
    while (count > 0) {
        count--;
        console.log(list[count]);
    }
}
sumQQ();
stack();