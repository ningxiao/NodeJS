var fs = require("fs");
var url = require('url');
var http = require("http");
var config = require("./db/config");
var httpServlet,port = 80,actionrepos =  {};
var routing = ["/add","/del","/update"];
function httpOutput(response,path){
	fs.createReadStream(path,{"autoClose":true}).pipe(response);
}
function routing404(requset,response){
	response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
	httpOutput(response,config.pathview+"404.tmpl");	
}
function getHandle(path){
	return actionrepos[path] || routing404;
}
function assembly(){
	for(var key,i=0,l = routing.length;i<l;i++){
		key = routing[i];
		actionrepos[key] = require("./actions"+key);
	}
	actionrepos["/"] = require("./actions/index");
}
httpServlet = http.createServer(function(requset,response){
	var pathname = url.parse(requset.url).pathname;
	getHandle(pathname)(requset,response);
	// var result = url.parse(requset.url),pathname = result.pathname;
	// switch(pathname){
	// 	case '/':
	// 	   response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
	// 	   httpOutput(response,dbpath+"index.tmpl");
	// 	break;
	// 	case '/add':
	// 	    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
	// 	    if(requset.method === "GET"){
	// 	    	response.end(JSON.stringify(mysqldb.list()));
	// 	    }else{
	// 	    	mysqldb.add({"id":1,"name":"宁肖"});
	// 	    	mysqldb.store();	
	// 	    	response.end("添加数据成功");	    	
	// 	    }
	// 	break;
	// 	case '/del':
	// 	break;
	// 	case '/update':
	// 	    if(requset.method === "GET"){

	// 	    }else{

	// 	    }
	// 	break;
	// 	default:
	// 		response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
	// 		httpOutput(response,dbpath+"404.tmpl");
	//}
});
function main(argv) {
	if(argv.length==1){
		port = argv[0];
	}
	/**
	* 退出输出日志
	**/
	process.on('exit', function(error) {
	   console.log("服务器退出"); 
	});
	/**
	* 监听异常退出输出日志
	**/
	process.on('uncaughtException', function(error) {
	  console.log(error.toString()); 
	}); 
	assembly();	
	httpServlet.listen(port, function() {
	    console.log('服务器访问端口: '+port); 
	});
	httpServlet.on('error', function (error) {
		if(error.code == 'EADDRINUSE') {
	      console.log('服务端口被占用');
	      return;
	    }
	    console.log('开启服务异常'+error);
	});	
}
main(process.argv.slice(2));