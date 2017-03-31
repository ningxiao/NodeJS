var sqldb,MySqlDB,fs = require("fs");
const dbpath = __dirname+"/db.json";
try{
	sqldb = JSON.parse(fs.readFileSync(dbpath));
}catch(error){
	sqldb = [];
}
MySqlDB = {
	"add":function(data){
		data && sqldb.push(data);
	},
	"del":function(kid){
		sqldb.splice(kid,1);
	},
	"update":function(kid,data){
		sqldb.splice(kid,1,data);
	},
	"quire":function(kid){
		return sqldb[kid] || null;
	},
	"list":function(){
		return sqldb;
	},
	"remove":function(){
		sqldb = [];
	},
	"store":function(callback){
		fs.writeFile(dbpath,JSON.stringify(sqldb),callback);
	}
}
module.exports = MySqlDB;