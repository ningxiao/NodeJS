const fs = require("fs");
const ws = fs.createWriteStream('./data.json', {
    flags: 'w',
    encoding: 'utf8',
    mode: 0o666
});
const tmpl =`
    ["frase primera", "primer trozo 遭受不公 de informacion para procesado primer trozo"],
    ["segunda frase", "segundo trozo de informacion trozo de"],
    ["cacho 3", "otro trozo para ser procesado otro otro otro trozo"],
    ["cuarta frase", "primer trozo 时运不济 de informacion para procesado primer trozo"],
    ["frase 5", "segundo trozo de informacion trozo de"],
    ["sexto cacho", "otro 遭受不公 trozo para ser procesado otro otro otro trozo"],
    ["so cacho", "otro trozo para ser procesado otro otro otro trozo"],
    ["cuarta", "primer trozo de 孤独 informacion para procesado primer trozo 黑化"],
    ["primera", "primer trozo de informacion 失败 嘲笑 孤独 黑化 para procesado primer trozo"],
    ["frase", "segundo trozo de informacion trozo de"],
    ["frase23", "segundo trozo de informacion trozo de"],
    ["sexto", "otro 遭受不公 trozo para 痛苦 抑郁 堕落 ser procesado otro otro otro trozo"],
    ["socacho", "otro trozo para ser procesado otro otro otro trozo"],
    ["cuarta to", "primer trozo de 孤独 informacion para procesado primer trozo 黑化"],
    ["primera string", "primer trozo de informacion 痛苦 抑郁 堕落 para procesado primer trozo"],
    ["nx", "segundo trozo de informacion trozo de"],
    ["bols", "兔子 trozo de 老虎 trozo 苹果"],
    ["txt", "遭受不公 背叛 时运不济 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 的最好机会 但也是任何一个人成长 升华的最好机会"],
    ["reduce","遭受不公 背叛 时运不济 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 的最好机会 但也是任何一个人成长 升华的最好机会"],
    ["frase primera", "primer trozo 遭受不公 de informacion para procesado primer trozo"],
    ["segunda frase", "segundo trozo de informacion trozo de"],
    ["cacho 3", "otro trozo para ser procesado otro otro otro trozo"],
    ["cuarta frase", "primer trozo 时运不济 de informacion para procesado primer trozo"],
    ["frase 5", "segundo trozo de informacion trozo de"],
    ["sexto cacho", "otro 遭受不公 trozo para ser procesado otro otro otro trozo"],
    ["so cacho", "otro trozo para ser procesado otro otro otro trozo"],
    ["cuarta", "primer trozo de 孤独 informacion para procesado primer trozo 黑化"],
    ["primera", "primer trozo de informacion 失败 嘲笑 孤独 黑化 para procesado primer trozo"],
    ["frase", "segundo trozo de informacion trozo de"],
    ["frase23", "segundo trozo de informacion trozo de"],
    ["sexto", "otro 遭受不公 trozo para 痛苦 抑郁 堕落 ser procesado otro otro otro trozo"],
    ["socacho", "otro trozo para ser procesado otro otro otro trozo"],
    ["cuarta to", "primer trozo de 孤独 informacion para procesado primer trozo 黑化"],
    ["primera string", "primer trozo de informacion 痛苦 抑郁 堕落 para procesado primer trozo"],
    ["nx", "segundo trozo de informacion trozo de"],
    ["bols", "兔子 trozo de 老虎 trozo 苹果"],
    ["txt", "遭受不公 背叛 时运不济 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 的最好机会 但也是任何一个人成长 升华的最好机会"],
    ["reduce","遭受不公 背叛 时运不济 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 的最好机会 但也是任何一个人成长 升华的最好机会"],`;
let i = 100;
ws.write('[\r');
while (i) {
    ws.write(tmpl);
    i--;
}
ws.write('\r    ["reduce","遭受不公 背叛 时运不济 失败 嘲笑 孤独 痛苦 抑郁 堕落 黑化 的最好机会 但也是任何一个人成长 升华的最好机会"]');
ws.write('\r]');