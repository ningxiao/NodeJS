var server = require("./modules/server");
var router = require("./modules/router");
var requestHandlers = require("./modules/requestHandlers");
var handle = {};
//配置对应请求路由
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
//开始htt服务
server.start(router.route, handle);