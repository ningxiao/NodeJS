var fs = require("fs");
var url = require("url");
var tmpl = require("../utils/tmpl");
var config = require("../db/config");
var MySqlDB = require("../db/mysqldb");
var querystring = require('querystring');
function controller(requset,response){
	var data,query = "";
	if(requset.method === "GET"){
		query = querystring.parse(url.parse(requset.url).query);
		data = MySqlDB.quire(query.uid);
		data["uid"] = query.uid;
		tmpl(config.pathview+"update.tmpl",data,function(tpl){
			response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
			response.end(tpl);
		});
	}else{
		requset.on('data',function (postchunk) {  
	      query += postchunk;
	    });
	    requset.on('end',function(){
	    	var nowDate = new Date();
	    	query = querystring.parse(query); 
	    	query["author"] = "宁肖";
	    	query["date"] = nowDate.toLocaleDateString() + " "+ nowDate.toLocaleTimeString();
	    	MySqlDB.update(query.uid,query);
	    	MySqlDB.store();
	    	response.writeHead(302,{"Location":"/"});
	    	response.end();	    	
	    });
	}
}
module.exports = controller;