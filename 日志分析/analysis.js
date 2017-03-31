function analysis(base,contrast){
    var key,map = {},count = 0,baselen = base.length,contrastlen = contrast.length;
    console.time('分析耗时');
    for(var i=0;i<contrastlen;i++){
        map[contrast[i]] = 1;
    }    
    for(var k=0;k<baselen;k++){
        if(base[k] in map){
            count++; 
        }
    }
    console.timeEnd('分析耗时');
    process.send({"result":"analysis","pid":process.pid,"count":count});
    process.exit();    
}
process.on('message', function(news){
    var mysql;
	process.nextTick(function(){
		if(news["command"] == "analysis") {
            mysql = news["data"];
            base = mysql["base"];
            contrast = mysql["contrast"];
            analysis(base,contrast);
        }
    });
 });           
//监听异常退出输出日志
process.on('uncaughtException', function(error) {
    console.log(error);
}); 