/**
 * 枚举生成全列数
 * 例如 123
 * 1,2,3
 * 1,3,2
 * 2,1,3
 * 2,3,1
 * 3,1,2
 * 3,2,1
 */
let a = new Uint8Array(new ArrayBuffer(10));
let book = new Uint8Array(new ArrayBuffer(10));
let n = 0;
const dfs = (step) => {
    let i = 0;
    let data = [];
    if (step === n + 1) {
        for (i = 1; i <= n; i++) {
            data.push(a[i]);
        }
        console.log(data.join(","));
        return;
    }
    for (i = 1; i <= n; i++) {
        if (book[i] === 0) {
            a[step] = i;
            book[i] = 1;
            dfs(step + 1);
            book[i] = 0;
        }
    }
}
process.stdin.setEncoding('utf8');
process.stdin.on('end', () => {
    process.stdout.write('运行完毕');
});
process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        n = parseInt(chunk);
        process.stdout.write(`您输入的枚举数: ${chunk}`);
        dfs(1);
        process.nextTick(() => {
            process.stdin.emit('end');
        });
    }
});
process.stdout.write(`请输入枚举生成全列数:`);