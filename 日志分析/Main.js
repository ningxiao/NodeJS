var fs = require('fs'); 
var os = require("os");
var net = require('net');
var url = require('url'); 
var worker = require('child_process');
var querystring = require('querystring');
var socketHead = require('./com/socketHead');
var task,counter=0,count = 0,PORT = 6969,HOST = '192.168.202.204',cpus = os.cpus().length;
function child_message(message){
	if(message["result"] === "analysis"){
		count += message["count"];
		counter++;
		if(parseInt(counter)>=cpus){
			task.end(socketHead.SetHeader("工作进程"+message["pid"]+"处理完成\r\n任务完成相同CID为"+count));
			counter=0,count = 0
		}else{
			task.write(socketHead.SetHeader("工作进程"+message["pid"]+"处理完成"));
		}		
	}
}
function create_db(name){
	var list,mysql = fs.readFileSync("./db/"+name+".txt","utf-8");
	list = mysql.split("\r\n");
	return list;	
}
/**
* 初始化创建对应cpu数量的子进程
**/
function createworker(base,contrast){
	var indexs,fork,end = 0,bool = true,ends = [],contrastlen = contrast.length,start = 0,step = parseInt(contrastlen/cpus);
	while(bool){
		end+=step;
		if(end>contrastlen){
			end = contrastlen;
			bool = false;
		}
		ends.push([start,end]);
		start = end;
	}
	if(ends.length>cpus){
		ends[cpus-1][1] = ends[ends.length-1][1];
		ends.length = cpus;
	}
	for(var i=0;i<cpus;i++){
		indexs = ends[i];
		if(indexs){
			fork = worker.fork("./analysis.js",['normal']);
			fork.once('error',function(){
				console.log("子进程异常");
			});
			fork.once('close',function(){
				console.log("子进程关闭");
			});
			fork.once('message',child_message); 				
			fork.send({'command':"analysis",'data':{"base":base,"contrast":contrast.slice(indexs[0],indexs[1])}});			
		}
	} 
}
/**
* 服务器开启成功
**/
function main(argv) {
	var list = [];
	if(argv.length==2){
		for(var i=0;i<2;i++){
			list.push(create_db(argv[i]));
		}
		createworker(list[0],list[1]);
	}  
}
net.createServer(function(socket) {    
    socket.on('data', function(data) {
       var key = socket.remoteAddress +':'+ socket.remotePort;
       var heade = socketHead.GetHeader(data,true);
       var body = url.parse(heade.body);
       if(body.pathname == '/Analysislog'){
       	  task = socket;
       	  data = querystring.parse(body.query);
       	  main(data.cid);
       }else{
       	socket.end(socketHead.SetHeader("非法任务"));
       } 
    });
    socket.on('close', function(data) {
        console.log('任务链接结束');
    });  
}).listen(PORT, HOST);
//main(process.argv.slice(2));
