var fs = require("fs");
var url = require("url");
var config = require("../db/config");
var MySqlDB = require("../db/mysqldb");
var querystring = require('querystring');
function controller(requset,response){
	var query = "";
	if(requset.method === "GET"){
		response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
		fs.createReadStream(config.pathview+"add.tmpl",{"autoClose":true}).pipe(response);
	}else{
		requset.on('data',function (postchunk) {  
	      query += postchunk;
	    });
	    requset.on('end',function(){
	    	var nowDate = new Date();
	    	query = querystring.parse(query); 
	    	query["author"] = "宁肖";
	    	query["date"] = nowDate.toLocaleDateString() + " "+ nowDate.toLocaleTimeString();
	    	MySqlDB.add(query);
	    	MySqlDB.store();
	    	response.writeHead(302,{"Location":"/"});
	    	response.end();	    	
	    });
	}
}
module.exports = controller;