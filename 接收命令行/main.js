const fs = require('fs');
const out = process.stdout;
const path = require('path');

function copy(src, dst) {
	let stat = fs.statSync(src);
	let readstream = fs.createReadStream(src);
	let writestream = fs.createWriteStream(dst);
	let totalSize = stat.size;
	let passedLength = 0;
	let lastSize = 0;
	let startTime = Date.now();
	readstream.on('data', chunk => { // 当有数据流出时，写入数据
		passedLength += chunk.length;
		if (writestream.write(chunk) === false) { // 如果没有写完，暂停读取流
			readstream.pause();
		}
	});
	writestream.on('drain', function () { // 写完后，继续读取
		readstream.resume();
	});
	readstream.on('end', function () { // 当没有数据时，关闭数据流
		writestream.end();
	});
	readstream.pipe(writestream);
	setTimeout(function show() {
		var endTime, percent = Math.ceil((passedLength / totalSize) * 100), size = Math.ceil(passedLength / 1000000), diff = size - lastSize;
		lastSize = size;
		out.clearLine();
		out.cursorTo(0);
		out.write('已完成' + size + 'MB, ' + percent + '%, 速度：' + diff * 2 + 'MB/s');
		if (passedLength < totalSize) {
			setTimeout(show, 500);
		} else {
			endTime = Date.now();
			console.log();
			console.log('共用时：' + (endTime - startTime) / 1000 + '秒。');
		}
	}, 500);
}
function main(argv) {
	copy.apply(this, argv);
}
main(process.argv.slice(2));