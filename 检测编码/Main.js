var fs = require('fs'); 
var data = fs.readFileSync("testa.txt");
if (data[0] == 0xEF && data[1] == 0xBB && data[2] == 0xBF) {
    console.log("说明是 utf8编码");
}else{
    console.log("一顿假设, 当作GBK");
}