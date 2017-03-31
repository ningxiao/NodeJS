var path = require('path');
exports.level = 4;
exports.port = 8888;
exports.success = "成功";
exports.fail = "失败";
exports.queue="没有对应api接口提供！"
exports.dbpath = path.dirname(__dirname)+"\\db\\";
//配置对应请求路由
exports.router = {"/":false,"/add":"添加队列","/del":"删除队列","/get":"获取队列","/cre":"创建队列"};