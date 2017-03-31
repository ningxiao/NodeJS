function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
 }
function start() {
	//开启阻塞等待两秒返回数据
	sleep(10000);
	return "你好开始执行Start";
}
function upload() {
	return "你好开始执行Upload";
}
exports.start = start;
exports.upload = upload;
//module.exports = {'start':start,"upload":upload}
