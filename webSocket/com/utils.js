var os = require('os');
var crypto = require('crypto');
/**
  *console.log('本机ip地址(不包括Ipv6):', getLocalIps());
  *console.log('本机ip地址(包括Ipv6):', getLocalIps(true)); 
 */
function getLocalIps(flagIpv6) {
	var ips = [],ifaces = os.networkInterfaces();
	var func = function(details) {
	    if (!flagIpv6 && details.family === 'IPv6') {
	        return;
	    }
	    ips.push(details.address);
	};
	for (var dev in ifaces) {
	    ifaces[dev].forEach(func);
	}
	return ips;
};
function websocketkey(val){
	var key = val+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11",shakey = crypto.createHash('sha1');
	shakey.update(key);
	key = shakey.digest('base64');
	return key;
}
function SetHeader(request,bool){
	var length,bytes,header = "";
	if(bool){
		bytes = SetSocketHeader(request);
	}else{
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
	}
	return bytes;	
}
function SetSocketHeader(request){
	var header = "HTTP/1.1 101 Switching Protocols\r\n";
	header+="Server:Nxiao\r\n";
	header+="Connection: Upgrade\r\n"; 
	header+="Upgrade:WebSocket\r\n";  
	header+="Date:"+request["Date"]+"\r\n"; 
	header+="Access-Control-Allow-Credentials:true\r\n"; 
	header+="Access-Control-Allow-Headers:content-type\r\n";
	header+="Sec-WebSocket-Accept:"+request["Sec-WebSocket-Accept"]+"\r\n\r\n";
	return new Buffer(header);
}
function GetHeader(bytes){
	var list,arrs,resultData,headPos,header={};
	resultData = bytes.toString('utf-8');
	headPos = resultData.indexOf("\r\n\r\n");
	list = resultData.substr(0,headPos).split("\r\n");
	for(var i=0,l=list.length;i<l;i++){
		arrs = list[i].split(": ");
		header[arrs[0]] = arrs[1];
	}
	if(headPos!=-1){
		header.body = bytes.slice(headPos+4);
	}
	return header;
}
function Parse_msg(data){
	var i,mask_flag,payload_len
	data = data || null;
	if(( data.length <= 0)||(!Buffer.isBuffer(data))){
		return null;
	}
	mask_flag = (data[1] & 0x80 == 0x80) ? 1 : 0;
	payload_len = data[1] & 0x7F;
	if(payload_len == 126){
		masks = data.slice(4,8);
		payload_data = data.slice(8);
		payload_len = data.readUInt16BE(2);
	}else if(payload_len == 127){
		masks = data.slice(10,14);
		payload_data = data.slice(14);
		payload_len = data.readUInt32BE(2) * Math.pow(2,32) + data.readUInt32BE(6);
	}else{
		masks = data.slice(2,6);
		payload_data = data.slice(6);
	}
	for(i=0;i< payload_len;i++ ){
		payload_data[i]= payload_data[i] ^ masks[i%4];
	}
	return payload_data;
}
function Build_msg(str_msg,mask){
	var msg_len,packed_data;
	str_msg = str_msg || "";
	mask = mask || false;
	msg_len = Buffer.byteLength(str_msg,"utf-8");
	if( msg_len <= 0 ){
		return null;
	}
	if( msg_len < 126 ){
		packed_data = new Buffer(2+msg_len);
		packed_data[0] = 0x81;
		packed_data[1] = msg_len;
		packed_data.write( str_msg, 2 );
	}else if( msg_len <= 0xFFFF ){//用16位表示数据长度
		packed_data = new Buffer(4 + msg_len);
		packed_data[0] = 0x81;
		packed_data[1] = 126;
		packed_data.writeUInt16BE( msg_len, 2 );
		packed_data.write( str_msg, 4 );
	}else{//用64位表示数据长度
		packed_data = new Buffer(10+msg_len);
		packed_data[0] = 0x81;
		packed_data[1] = 127;
		packed_data.writeUInt32BE(msg_len & 0xFFFF0000 >> 32, 2);
		packed_data.writeUInt32BE(msg_len & 0xFFFF, 6);
		packed_data.write( str_msg, 10 );
	}
	return packed_data;
}
module.exports = {"buildmsg":Build_msg,"parsemsg":Parse_msg,"getHeader":GetHeader,"setHeader":SetHeader,"ips":getLocalIps,"shkey":websocketkey};