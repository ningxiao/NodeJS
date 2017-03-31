var utils = require('./utils');
function SetHeader(body,meta){
   var headsize,headcode,metasize,bodysize,header;
   if(body && !utils.isBuffer(body)){
   	body = new Buffer(body);
   }
   if(meta && !utils.isBuffer(meta)){
   	meta = new Buffer(meta);
   }
   bodysize = body.length;
   metasize = meta?meta.length:0;
   header = new Buffer(12+metasize+bodysize);
   headcode = headsize = 12+metasize+bodysize;
   header.writeInt32LE(headsize,0);//写入包总长度
   header.writeInt32LE(metasize,4);//写入元数据信息长度
   meta && meta.copy(header,8);//写入元数据
   body.copy(header,8+metasize);//写入传递数据
   header.writeInt32LE(headcode,headsize-4);//验证码
   return header;	
}
function GetHeader(data,enco){
	var bodydata,headsize,metasize,metadata,metaoend;
	headsize = data.readInt32LE(0);//读取包总长度
	metasize = data.readInt32LE(4);//读取元数据信息长度
	metaoend = 8;
	if(metasize){
		metaoend = 8+metasize;
		metadata = data.slice(8,metaoend);//读取元数据
	}
	bodydata = data.slice(metaoend,headsize-4);//读取数据
	if(enco){
		metadata && (metadata = metadata.toString());
		bodydata && (bodydata = bodydata.toString());
	}
	return {"meta":metadata,"body":bodydata};
}
module.exports = {"GetHeader":GetHeader,"SetHeader":SetHeader};