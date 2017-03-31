var fs = require('fs');
var callshell = require('./node_modules/execshell');
var child = new callshell.shell();
var callnum=0,chunks = [],size=0,bool=true,swfsize,buffer;
function copyFile(readpath,writepath){
	var readable,writable;      
	fs.exists(readpath, function(exists){
		if(exists){
		    readable = fs.createReadStream(readpath);// 创建读取流
			writable = fs.createWriteStream(writepath);// 创建写入流   
			readable.pipe(writable);	// 通过管道来传输流	
			readable.on('end', function() { // 当没有数据时，关闭数据流
			    callnum++;
			    writable.end();
			    if(callnum==2){
			    	encryptswf();
			    }
			});				
		}
	});
}
function encryptswf(){
	var playLen,pngLen;
	buffer = fs.readFileSync("./swf/Main.jpg");
	chunks.push(buffer);
	pngLen = buffer.length;
	size+=buffer.length;
	
	buffer = fs.readFileSync("./swf/BaoFengVideoPlayer.swf");
	chunks.push(buffer);
	playLen = buffer.length;
	size+=buffer.length;
	console.log("-----",buffer.length);
	
	buffer = fs.readFileSync("./swf/BfNetFactory.swf");
	chunks.push(buffer);
	size+=buffer.length;
	console.log(buffer.length);

	buffer = new Buffer(4);
	buffer.writeInt32BE(19870615,0);
	chunks.push(buffer);
	size+=buffer.length;

	buffer = new Buffer(4);
	buffer.writeInt32BE(playLen,0);
	chunks.push(buffer);
	size+=buffer.length;	

	buffer = new Buffer(4);
    buffer.writeInt32BE(size - pngLen,0);
	chunks.push(buffer);
	size+=buffer.length;

	buffer = new Buffer(size);	
	for (var i = 0, len = chunks.length, pos = 0; i < len; i++) {
	     chunks[i].copy(buffer, pos);
	     pos += chunks[i].length;
	}
	fs.writeFile('./encrypt/bfvd.jpg', buffer, function (err) {
	    if (err) {
	        throw err;
	    } else {
	        console.log('压缩加密完毕！');
	    }
	});
}
child.addEventListener(callshell.events.SUCCESS, function(event){
	callnum++;
	if(callnum==2){
		callnum = 0;
		copyFile("D:/javaProject/CloudsNetFactory/bin-release/BfNetFactory.swf","C:/Users/ningxiao.JINAOBF/Desktop/Node分享/NodeJS/云视频压缩/swf/BfNetFactory.swf");
		copyFile("D:/javaProject/CloudsPlayV1.0/bin-release/OutVideoPlayer.swf","C:/Users/ningxiao.JINAOBF/Desktop/Node分享/NodeJS/云视频压缩/swf/OutVideoPlayer.swf");
	}
});
child.addEventListener(callshell.events.ERROR, function(event){
	console.log(event);
});
encryptswf()
//child.runSh('D: && cd D:/javaProject/CloudsNetFactory && mxmlc -load-config flex-config.xml  src/com/bf/ns/bfnsinterface/BfNetFactory.as');
//child.runSh('D: && cd D:/javaProject/CloudsPlayV1.0 && mxmlc -load-config flex-config.xml  src/OutVideoPlayer.as');
//copyFile("D:/javaProject/CloudsNetFactory/bin-release/BfNetFactory.swf","C:/Users/ningxiao.JINAOBF/Desktop/Node分享/NodeJS/云视频压缩/swf/BfNetFactory.swf");
//copyFile("D:/javaProject/CloudsPlayV1.0/bin-release/OutVideoPlayer.swf","C:/Users/ningxiao.JINAOBF/Desktop/Node分享/NodeJS/云视频压缩/swf/OutVideoPlayer.swf");