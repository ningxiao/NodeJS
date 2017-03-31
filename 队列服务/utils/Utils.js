var fs = require('fs');
function getqueueSize(buf,offset){
	offset = offset || 0;
	return buf.readInt32BE(offset);
}
function setqueueSize(buf,size,offset){
	offset = offset || 0;
	buf.writeInt32BE(size, offset);
}
function pathname(data){
	var index = data.indexOf("?"),pathname="/";
	if(index!=-1){
		pathname = data.substr(0,index);
	}
	return pathname;
}
function isexists(path){
	return fs.existsSync(path);
}
exports.pathname = pathname;
exports.isexists = isexists;
exports.setqueueSize = setqueueSize;
exports.getqueueSize = getqueueSize;