var fs = require("fs");
var url = require("url");
var config = require("../db/config");
var MySqlDB = require("../db/mysqldb");
var querystring = require('querystring');
function controller(requset,response){
	var query = "";
	if(requset.method === "GET"){
		query = querystring.parse(url.parse(requset.url).query);
		MySqlDB.del(query["uid"]);
		MySqlDB.store();
	}
	response.writeHead(302,{"Location":"/"});
	response.end();
}
module.exports = controller;