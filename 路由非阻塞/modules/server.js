var http = require("http");
var url = require("url");
var port = 8888;
/**
 * 开启http服务
 * @param route 路由对象
 * @param handle 处理对象
 */
function start(route, handle) {
	/**
	 * 开启http服务
	 * @param request 请求对象
	 * @param response 返回对象
	 */
	function onRequest(request, response) {
	  var pathname = url.parse(request.url).pathname,content;
	  //console.log("收到请求" + pathname);
	  route(handle,pathname,response);
	}	
	http.createServer(onRequest).listen(port);
	console.log("开启http服务"+port);
}
exports.start = start;