var config = require('./com/config');
var gateway = require('./com/gateway');
var socketHead = require('./com/socketHead');
var uidmap = {},sockets = [];
//监听异常退出输出日志
process.on('uncaughtException', function(error) {
   console.log(error);
}); 
process.on("message", function(msg,socket){
    process.nextTick(function(){
        if(msg == config.ACCESS && socket) {
            var enckey,isToken = true,key = socket.remoteAddress +':'+ socket.remotePort;   
            enckey = gateway.EncToken(config.GATEWAYKEY,config.GATEWAYVI);
            uidmap[key] = enckey.uid;
            socket.readable = socket.writable = true;
            socket.resume();            
            socket.write(socketHead.SetHeader(enckey.key));
            sockets.push(socket);
            console.log(sockets.length);
            socket.on('data', function(data) {
                var key,heade = socketHead.GetHeader(data,true);
                if(isToken){
                    isToken = false;
                    if(enckey.uid == heade.body){
                        console.log("服务端认证秘钥"+heade.body+"  "+heade.meta);
                        socket.write(socketHead.SetHeader("成功!"));
                    }else{
                        socket.end(socketHead.SetHeader("失败!"));
                    }  
                }else{
                    key = gateway.DecToken(heade.body,config.GATEWAYKEY,config.GATEWAYVI);
                    console.log("客服端认证秘钥"+key+"  "+heade.meta);
                    socket.write(socketHead.SetHeader(key));      
                }
            });
            socket.on('close', function(data) {
                isToken = sock = key = enckey = null;
                console.log("断开服务"+uidmap[key]);
                delete uidmap[key];
            });  
        }else{
            switch(msg.key){
                case "push":
                  for(var i=0,l = sockets.length;i<l;i++){
                    sockets[i].write(socketHead.SetHeader(msg.map));
                  }
                  break;
                default:
            }
        }
    });
 });           
