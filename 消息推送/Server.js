var utils = require('./com/utils.js');
var socketmap = {};
function connectionAgreement(data){
    var key,version,header = utils.getHeader(data);
    key = utils.shkey(header["Sec-WebSocket-Key"]);
    version = header["Sec-WebSocket-Version"];
    return utils.setHeader({"Date":new Date(),"Sec-WebSocket-Accept":key,"Sec-WebSocket-Version":version},true);
}
function pushsocket(data,uid){
    var socket;
    for(var key in socketmap){
        if(key != uid){
            socket = socketmap[key];
            socket.write(utils.buildmsg(data));
        }
    } 
}
function distributetask(data,uid){
    var list,socket,key = "ALL",news = data;
    if(data.indexOf("@")!=-1){
        list = data.split("@");
        key = list[0];
        news = list[1];
    }
    switch(key){
        case "ALL":
          pushsocket(uid+":"+data,uid);
          process.send({"head":"pushall","data":{"news":news,"pid":process.pid}});          
        break;       
        default:
        if(key in socketmap){
            socket = socketmap[key];
            socket.write(utils.buildmsg(key+":"+data));
        }else{
            process.send({"head":"pushonly","data":{"news":news,"uid":key,"pid":process.pid}});   
        }
    }
}
function handlesocket(socket,uid){
    socket.on('data', function(data) {
        var bytes = utils.parsemsg(data);
        if(bytes.length){
            distributetask(bytes.toString(),uid);
        } 
    });
    socket.on('end', function(data) {
        console.log("结束");
    });  
    socket.on('error', function(data) {
        console.log("异常");
    });        
    socket.on('close', function(data) {
        delete socketmap[uid];
        process.send({"head":"deldate","data":uid});
    }); 
    process.send({"head":"update","data":uid});    
}
//监听异常退出输出日志
process.on('uncaughtException', function(error) {
   console.log(error);
}); 
process.on("message", function(msg,socket){
    process.nextTick(function(){
        var uid;
        switch(msg.head){
            case "init":
                uid = socket.remoteAddress +':'+ socket.remotePort; 
                console.log(uid);
                socket.readable = socket.writable = true;     
                socket.once('data', function(data) {
                    var header = connectionAgreement(data); 
                    handlesocket(socket,uid);        
                    socketmap[uid] = socket;
                    socket.write(header);                         
                }); 
                socket.resume(); 
            break;
            case "pushall":
                pushsocket(msg["data"]);
            break;
            case "pushonly":
                uid = msg["data"]["uid"];
                if(uid in socketmap){
                    socket = socketmap[uid];
                    socket.write(utils.buildmsg(uid+":"+msg["data"]["news"]));
                }
            break;            
            default:
        }         
    });
 });           
