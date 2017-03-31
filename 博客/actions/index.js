var fs = require("fs");
var tmpl = require("../utils/tmpl");
var config = require("../db/config");
var MySqlDB = require("../db/mysqldb");
function controller(requset,response){
	tmpl(config.pathview+"index.tmpl",MySqlDB.list(),function(tpl){
		response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
		response.end(tpl);
	});
}
module.exports = controller;