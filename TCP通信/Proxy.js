var http = require('http');
var options = {
  hostname: 'www.baofengcloud.com',
  port: 80,
  path: '/video/getvideolist?servicetype=1&pagenum=0&pagesize=20&filename=&videostatus=&uploadtime_begin=&uploadtime_end=&ifpublic=&callback=jQuery1830236374719068408_1421314464687&_=1421314464732',
  method: 'GET',
  headers:{
    "Accept":"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
    "Accept-Encoding":"gzip,deflate,sdch",
    "Accept-Language":"zh-CN,zh;q=0.8",
    "Host":"www.baofengcloud.com",
    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
    "Cookie":"cuid=%257B%2522userid%2522%253A%25222%2522%252C%2522username%2522%253A%2522karon%2522%257D; tk=cfd4895ade147d4d645832d7d27b370237645d05; PHPSESSID=600012519342696a67a7c1fdd2b50dfa; c_servicetype=1"
  }
};
var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
  res.on('close', function () {
    console.log('关闭: ');
  });  
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.end();