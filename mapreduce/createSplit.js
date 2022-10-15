import {
    createWriteStream
} from 'node:fs';
const tmpl = `["frase primera", "primer trozo 遭受不公 de informacion para procesado primer trozo"]
["segunda frase", "segundo trozo de informacion trozo de"]
["cacho 3", "otro trozo para ser procesado otro otro otro trozo"]
["cuarta frase", "primer trozo 时运不济 de informacion para procesado primer trozo"]
["frase 5", "segundo trozo de informacion trozo de"]
["sexto cacho", "otro 遭受不公 trozo fuck para ser procesado otro otro otro trozo"]
["so cacho", "otro trozo para ser procesado otro 阳光 otro otro trozo"]
["cuarta", "primer 时运不济 trozo de 孤独 informacion para procesado primer trozo 黑化"]
["primera", "primer trozo de informacion 失败 嘲笑 孤独 黑化 para procesado primer trozo"]
["frase", "segundo 时运不济 trozo de informacion trozo de"]
["frase23", "segundo trozo de informacion trozo de"]
["sexto", "otro 遭受不公 trozo para 痛苦 抑郁 堕落 ser procesado otro otro otro trozo"]
["socacho", "otro trozo para ser procesado otro otro otro trozo"]
["cuarta to", "primer 阳光 trozo de 孤独 informacion 开心 para 阳光 procesado primer trozo 黑化"]
["primera string", "primer trozo 开心 de informacion 痛苦 抑郁 堕落 para procesado primer trozo"]
["nx", "segundo trozo de informacion trozo de"]
["bols", "兔子 trozo de 老虎 trozo 苹果"]
["txt", "遭受不公 背叛 时运不济 fuck 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 阳光的最好机会 但也是任何一个人成长 升华的最好机会"]
["reduce","遭受不公 背叛 时运不济 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 的最好机会 但也是任何一个人成长 升华的最好机会"]
["frase primera", "primer trozo 遭受不公 de informacion para procesado primer trozo"]
["segunda frase", "segundo trozo de informacion trozo de"]
["cacho 3", "otro trozo para ser procesado otro otro otro trozo"]
["cuarta frase", "时运不济 primer trozo 时运不济 de informacion para procesado primer trozo"]
["frase 5", "segundo trozo 开心 de informacion trozo de"]
["sexto cacho", "otro 遭受不公 trozo 时运不济 para ser procesado otro otro otro trozo"]
["so cacho", "otro trozo para ser 乐天派 乐天派 procesado otro otro otro trozo"]
["cuarta", "primer trozo de 孤独 informacion para procesado primer trozo 黑化"]
["primera", "primer trozo 乐天派 de informacion 开心 失败 嘲笑 孤独 黑化 para procesado primer trozo"]
["frase", "segundo trozo de fuck informacion trozo de"]
["frase23", "segundo trozo de informacion trozo de"]
["sexto", "otro 遭受不公 trozo para 痛苦 抑郁 堕落 ser procesado otro otro otro trozo"]
["socacho", "otro trozo 乐天派 para ser procesado otro otro otro trozo"]
["cuarta to", "primer trozo de 孤独 阳光 informacion 开心 para fuck 阳光 procesado primer trozo 黑化"]
["primera string", "primer 阳光 trozo de informacion 痛苦 抑郁 堕落 para procesado primer trozo"]
["nx", "segundo trozo de informacion trozo de"]
["bols", "兔子 trozo de 老虎 trozo 苹果"]
["txt", "遭受不公 背叛 fuck 时运不济 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 fuck 的最好机会 但也是任何一个人成长 升华的最好机会"]
["reduce","遭受不公 背叛 时运不济 失败 fuck 嘲笑 孤独 痛苦 抑郁 堕落 黑化 的最好机会 但也是任何一个人成长 升华的最好机会"]
`;
export default (fileName, total = 1) => {
    return new Promise(resolve => {
        let i = total;
        const write = createWriteStream(`./splits/split${fileName}.log`, { flags: 'w', encoding: 'utf8', mode: 0o666 });
        write.once('close', () => {
            resolve('执行完成')
        });
        while (i) {
            write.write(tmpl);
            i--;
        }
        write.end();
    });
}