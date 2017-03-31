var server = require("./modules/server");
var router = require("./modules/router");
var requestHandlers = require("./modules/requestHandlers");
var handle = {};
//配置对应请求路由
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
//监听异常退出输出日志
process.on('uncaughtException', function(e) {
　　console.log(e);
});	
//开始htt服务
server.start(router.route, handle);