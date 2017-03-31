function SetHeader(request){
	var length,bytes,header = "";
	length = request.data?request.data.length:0;
	header+=request.method+" "+request.url+" HTTP/1.1\r\n";
	header+="Accept: html/text\r\n";
	header+="Host: "+request.host+"\r\n";
	header+="Content-Type: application/x-www-form-urlencoded\r\n";
	if(request.range){
		header+="Range: "+request.range+"\r\n";
	}
	header+="Content-Length: "+length+"\r\n";
	header+="Connection: Close\r\n\r\n";
	if(request.data){
		header = new Buffer(header);
		bytes = new Buffer(bytes.length+request.data.length);
		bytes.copy(header,0);
		bytes.copy(data,header.length);
	}else{
		bytes = new Buffer(header);	
	}
	return bytes;	
}
function GetHeader(bytes){
	var body,resultData,headPos;
	resultData = bytes.toString('utf-8');
	headPos = resultData.indexOf("\r\n\r\n")+4;
	if(headPos!=-1){
		body = bytes.slice(headPos);
	}
	return body;
}
function CopyByte(){

}
module.exports = {"GetHeader":GetHeader,"SetHeader":SetHeader};