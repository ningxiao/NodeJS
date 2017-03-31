var port = 80;
var fs = require("fs");
var url = require("url");
var zlib = require("zlib");
var http = require("http");
var path   = require('path'); 
var config = require("./plugin/config"); 
var plugins = require("./plugin/plugins"); 
var routerMap = config.routerMap;
var server = http.createServer(function(request,response){  
	var data = url.parse(request.url,true),query = data.query,pathname = data.pathname;
  var extname = path.extname(pathname).slice(1),contentType,expires;
  var host = request.headers.host;
    if(pathname.slice(-1) === "/"){
      extname = "html";
      pathname = pathname + config.Welcome.file;
    }
    if (typeof routerMap[pathname] === 'function') {
      pathname = routerMap[pathname](request,response);
      extname = path.extname(pathname).slice(1);
    }    
    if(host in config.Filter){
      realPath = "." + filterFile(pathname,host);
    }else{
      realPath = "." + pathname;
    }
    contentType = config.Mime[extname] || "text/plain";
    existsFile(realPath,response,request,contentType,extname);
});
function filterFile(url,host){
  if(url.indexOf(".js")!=-1 || url.indexOf(".css")!=-1){
    return url.replace(config.Filter[host],".");
  }
  return url; 
}
function existsFile(realPath,response,request,type,extname){
	var head,raw,acceptEncoding,matched;
  fs.stat(realPath, function (err, stats) {
    response.setHeader("Server", "Nxiao/V5");
    if(err){
      responseData(response,{"code":404,"value":{"Content-Type": "text/plain;charset=utf-8"},"data":"您请求的文件"+realPath+"不存在"});
    }else{
      if(stats.isDirectory()){
         realPath = path.join(realPath, "/", config.Welcome.file);  
      }else{
        raw = fs.createReadStream(realPath);
        acceptEncoding = request.headers['accept-encoding'] || "";   
        matched = extname.match(config.Compress.match);
        if(matched && acceptEncoding.match(/gzip/)){
          response.writeHead(200,"Ok", {'Content-Encoding': 'gzip','Content-Type': type+";charset=utf-8"});
          raw.pipe(zlib.createGzip()).pipe(response); 
        }else if(matched && acceptEncoding.match(/deflate/)){
          response.writeHead(200, "Ok", {'Content-Encoding': 'deflate','Content-Type': type+';charset=utf-8'});
          raw.pipe(zlib.createDeflate()).pipe(response);  
        }else{
          response.writeHead(200, "Ok",{'Content-Type': type});  
          raw.pipe(response); 
        }
      }
    }
  });
}
function responseData(response,head){
	response.writeHead(head.code, head.value); 
  if(head.data){
    response.write(head.data,""); 
  } 
	response.end();  
}
server.listen(port);  
console.log("开启服务端口: " + port + ".");  
