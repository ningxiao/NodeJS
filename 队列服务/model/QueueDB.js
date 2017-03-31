var fs = require('fs');
var utils = require('../utils/Utils');
var config = require('../model/Config');
function pushdb(name,buf,socket,callback,level){
	var path = config.dbpath+name+"\\"+(level || "0");
	fs.open(path, 'r+', function(err, fd) {
		if (err) {
			callback(socket,false);
			return;
		}
		fs.write(fd, buf, 0, buf.length, buf.length, function(err, written, buffer) {
			fs.closeSync(fd);
			if (err) {
				callback(socket,false);
				return;
			}
			console.log(buffer.length,buffer+"");
			callback(socket,true);
		});
	});	
}
function createdb(name,socket,callback){
	var path = config.dbpath+name;
	if(utils.isexists(path)){
		callback(socket,true);
	}else{
		fs.mkdir(path,"0777",function(error){
			var fd,suee = false;
			if(!error){
				suee = true;
				for(var i=0;i<config.level;i++){
					fd = fs.openSync(path+"\\"+i,"w","0777");
					if(!fd){
						suee = false;
					}else{
						fs.closeSync(fd);
					}
				}					
			}
			callback(socket,suee);		
		});		
	}
}
function cachedb (name,level){
	var buf = fs.readFileSync(config.dbpath+name+"\\"+level);
	//fs.writeFileSync(config.dbpath+name+"\\"+level, "");
	return buf;
}
exports.pushdb = pushdb;
exports.cachedb = cachedb;
exports.createdb = createdb;