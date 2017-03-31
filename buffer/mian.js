// 读取一条记录
// buf    Buffer对象
// offset 本条记录在Buffer对象的开始位置
// data   {number, lesson, score}
function writeRecord(buf, offset, data) {
	buf.writeUIntBE(data.number, offset, 3);
	buf.writeUInt16BE(data.lesson, offset + 3);
	buf.writeInt8(data.score, offset + 5);
}

// 写入一条记录
// buf    Buffer对象
// offset 本条记录在Buffer对象的开始位置
function readRecord(buf, offset) {
	return {
		number: buf.readUIntBE(offset, 3),
		lesson: buf.readUInt16BE(offset + 3),
		score: buf.readInt8(offset + 5)
	};
}

// 写入记录列表
// list  记录列表，每一条包含 {number, lesson, score}
function writeList(list) {
	var buf = new Buffer(list.length * 6);
	var offset = 0;
	for (var i = 0; i < list.length; i++) {
		writeRecord(buf, offset, list[i]);
		offset += 6;
	}
	return buf;
}

// 读取记录列表
// buf  Buffer对象
function readList(buf) {
	var offset = 0;
	var list = [];
	while (offset < buf.length) {
		list.push(readRecord(buf, offset));
		offset += 6;
	}
	return list;
}
var list = [{
	number: 100001,
	lesson: 1001,
	score: 99
}, {
	number: 100002,
	lesson: 1001,
	score: 88
}, {
	number: 100003,
	lesson: 1001,
	score: 77
}, {
	number: 100004,
	lesson: 1001,
	score: 66
}, {
	number: 100005,
	lesson: 1001,
	score: 55
}, ];
console.log(list);

var buf = writeList(list);
console.log(buf);