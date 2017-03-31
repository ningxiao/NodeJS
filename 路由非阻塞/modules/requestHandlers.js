
var childProcess = require("child_process");  
var childs = [],map={};
/**
* 利用子进程避免阻塞
**/
function start(response) {
var fork = getProcess();  
var pid = fork.pid;
    fork.on('message', function(message) {   
    	map[pid]["bool"] = false;
    	console.log("回收子进程");
    	write(response,"你好开始执行start");   
    });  
    fork.on('close', function(message) {   
    	console.log("清理子进程");
    });
    fork.send(pid);  
}
function getProcess(){
	var index=-1,fork;
	if(childs.length){
		for(var key in map){
			if(!map[key].bool){
				index = map[key].index;
				break;
			}
		}
	}
	if(index==-1){
		fork = childProcess.fork(__dirname + "/process.js"); 
		map[fork.pid] = {"index":childs.length,"bool":true};
		childs.push(fork);
		console.log("创建子进程");
	}else{
		fork = childs[index]; 
		map[fork.pid]["bool"] = true;
		console.log("提取子进程");
	}
	return fork;
} 
function upload(response) {
	write(response,"你好开始执行Upload");
}
function write(response,data){
	response.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
	response.write(data);
	response.end();  	
}
exports.start = start;
exports.upload = upload;
//module.exports = {'start':start,"upload":upload}
