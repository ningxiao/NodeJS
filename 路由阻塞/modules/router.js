/**
 * 路由请求处理
 * @param handle 处理对象
 * @param pathname 路由key
 */
function route(handle, pathname,response) {
  if (typeof handle[pathname] === 'function') {
  	console.log("找到路由的请求 " + pathname);
  	return handle[pathname]();
  } else {
    console.log("未找到请求配置路由" + pathname);
    return "404 Not found";
  }
}
exports.route = route;