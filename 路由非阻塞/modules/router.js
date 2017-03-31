/**
 * 路由请求处理
 * @param handle 处理对象
 * @param pathname 路由key
 */
function route(handle, pathname,response) {
  if (typeof handle[pathname] === 'function') {
  	//console.log("找到路由的请求 " + pathname);
  	handle[pathname](response);
  } else {
    //console.log("未找到请求配置路由" + pathname);
	response.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
	response.write("404 Not found");
	response.end();    
  }
}
exports.route = route;