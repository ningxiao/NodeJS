var http = require("http");
http.createServer(function(request, response){
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.end("Hello NodeJs");
}).listen(80);
console.log('服务开启 http://127.0.0.1');