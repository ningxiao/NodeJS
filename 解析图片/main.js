var fs = require('fs');
var socket = require('./com/HttpSocket.js');
var events = socket.HttpSocketEvents;
var socketHttp, host = '220.194.215.98',
    port = 81;
var picNum, headSize, videotime, piclist, picName;
var picsrc = "http://220.194.215.98/18/5345816/1/common/78517DBA1C7C60E75FFE16AAF46ACBF9.cov";
socketHttp = new socket.HttpSocket(host, port);

function analysisPicMetaData(position, bytes) {
    var end = position + 40,
        metavo = {};
    metavo.picName = bytes.toString("utf8", position, end);
    metavo.picPos = bytes.readInt32LE(end);
    metavo.picTime = bytes.readInt32LE(end + 4);
    metavo.picSize = bytes.readInt32LE(end + 8);
    return metavo;
}

function imgComplete(bytes) {
    fs.writeFile("./imgs/" + picName, bytes, function(err) {
        if (err) {
            throw err;
        } else {
            console.log('写入文件成功！');
        }
    });
}

function headComplete(bytes) {
    picNum = bytes.readInt32LE(0);
    headSize = bytes.readInt32LE(4);
    videotime = bytes.readInt32LE(8);
    console.log(picNum, headSize, videotime);
    socketHttp.removeEventListener(events.CONNECT, headComplete);
    socketHttp.addEventListener(events.CONNECT, queueComplete);
    socketHttp.load({ "data": null, "method": "GET", "range": "bytes=0-" + headSize, "host": host, "url": picsrc });
}

function queueComplete(bytes) {
    var index, picvo, start, end, position = 0;
    piclist = [];
    bytes = bytes.slice(12);
    for (var i = 0; i < picNum; i++) {
        piclist.push(analysisPicMetaData(position, bytes));
        position += 52;
    }
    socketHttp.removeEventListener(events.CONNECT, queueComplete);
    socketHttp.addEventListener(events.CONNECT, imgComplete);
    index = parseInt((piclist.length - 1) * Math.random());
    picvo = piclist[index];
    picName = picvo.picName;
    start = picvo.picPos;
    end = start + picvo.picSize;
    socketHttp.load({ "data": null, "method": "GET", "range": "bytes=" + start + "-" + end, "host": host, "url": picsrc });
}

function socketerror(news) {
    console.log(news);
}
socketHttp.addEventListener(events.CONNECT, headComplete);
socketHttp.addEventListener(events.ERROR, socketerror);
socketHttp.load({ "data": null, "method": "GET", "range": "bytes=0-11", "host": host, "url": picsrc });