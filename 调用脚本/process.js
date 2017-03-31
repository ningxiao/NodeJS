// var process = require('child_process'),child;
// function createDir(){
// 	child = process.exec('D: && cd execl && md mydir',function (error, stdout, stderr) {
// 		if (error !== null) {
// 		console.log('exec error: ' + error);
// 		}
// 	});	
// 	child.stdout.setEncoding('utf8');
// 	child.stdout.on('data', function (data) {
// 	  console.log('标准输出：' + data); 
// 	});
// 	child.stderr.on('data', function (data) {
// 		console.log('异常输出：' + data); 
// 	});
// 	child.on('exit', function (code) {
// 	  console.log('子进程已关闭，代码：' + code); 
// 	});	
// }
// function openApp(){
//     child = process.execFile('test.bat',null,null,
//       function (error,stdout,stderr) {
//         if (error !== null) {
//           console.log('exec error: ' + error);
//         }
//     });	
// 	child.stdout.setEncoding('utf8');
// 	child.stdout.on('data', function (data) {
// 	  console.log('标准输出：' + data); 
// 	});
// 	child.stderr.on('data', function (data) {
// 		console.log('异常输出：' + data); 
// 	});
// 	child.on('exit', function (code) {
// 	  console.log('子进程已关闭，代码：' + code); 
// 	});	    
// }
// openApp();

var callshell = require('./execshell');
var child = new callshell.shell();
child.addEventListener(callshell.events.SUCCESS, function(event){
	console.log(event);
});
child.addEventListener(callshell.events.ERROR, function(event){
	console.log(event);
});
child.addEventListener(callshell.events.ERROR, function(event){
	console.log(event);
});
// child.runSh('D: && cd execl && md mydir');
// child.runSh('E: && cd KuGou && md mydir');
child.runSh('D: && cd D:/javaProject/BfNetFactory && mxmlc -load-config flex-config.xml src/com/bf/ns/bfnsinterface/BfNetFactory.as && cd D:/javaProject/baofengVideoPlayerPPV4.4 && mxmlc -load-config flex-config.xml src/BaoFengVideoPlayer.as');