function getType (obj) {//取得对象的类型
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
}
function isBuffer(buf){
	if(getType(buf) == "Object" && "slice" in buf){
		return true;
	}	
	return false;
}
function getuid(){
    return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function (c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}
module.exports = {"isBuffer":isBuffer,"getuid":getuid};