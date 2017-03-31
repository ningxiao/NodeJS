function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}
process.on('message', function(data) {
	sleep(3000);//开启阻塞测试
	process.send(data);
});