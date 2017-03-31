'use strict';
class BufferCache {
	constructor(size = 2097152) {
		this.counter = 0;
		this.fileSize = 0;
		this.isEnd = false;
		this.buffers = []; // 缓冲区
		this.cutsize = size;
		this.datasource = Buffer.alloc(0);
	};
	/**
	 * 写入下载数据并且进行数据切片处理
	 * @param  {Buffer} buf 下载文件数据
	 */
	write(buf) {
		this.datasource = Buffer.concat([this.datasource, buf], this.datasource.length + buf.length);
		this.cutbuf();
	};
	end() { //结束的时候判断剩余数据是否被写入
		if (this.datasource.length != 0) { //如果最后一块数据刚好为0
			this.buffers.push({
				buf: this.datasource,
				vindex: this.counter
			});
			this.counter++;
			console.log("cut", "------>", this.datasource.length);
		};
		this.isEnd = true;
	};
	/**
	 * 数据切片处理(大于2097152字节数据进行分片)
	 */
	cutbuf() {
		let totallen = this.datasource.length;
		//数据大于2097152字节 进行数据分割处理
		if (totallen >= this.cutsize) {
			console.log("cut", "------>", this.cutsize);
			let newbuf, cutcount = Math.floor(totallen / this.cutsize);
			for (let i = 0; i < cutcount; i++) {
				//创建一个空片数据容器
				newbuf = Buffer.alloc(this.cutsize);
				this.datasource.copy(newbuf, 0, i * this.cutsize, (i + 1) * this.cutsize);
				this.buffers.push({
					buf: newbuf,
					vindex: this.counter
				});
				this.counter++;
			};
			this.datasource = this.datasource.slice(cutcount * this.cutsize);
		};
	};
	set size(size) {
		this.fileSize = size;
	};
	get size() {
		return this.fileSize;
	};
	get read() {
		return this.buffers.shift();
	};
	get chunks() {
		return this.buffers;
	};
}
module.exports = BufferCache;