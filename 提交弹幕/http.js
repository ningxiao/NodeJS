var http = require('http');
var querystring = require('querystring');
var post_data = new Buffer(querystring.stringify({
    'lid': 0,
    'uid': 61051014,
    'ver': 1,
    'time': 1456391432,
    'iid': 330981899,
    'ct': 1001,
    'ouid': 97454045,
    'type': 1,
    'content': '撒打算',
    'sign': '0a305c1d85a1d1a5589ce9b030d83f10',
    'aid': 20938,
    'propertis': '',
    'playat': 483000
}));
var post_options = {
    'host': 'service.danmu.youku.com',
    'port': '80',
    'path': '/add?t=GSCCYXUWSPD9HQS29HRO4PG770J2VWU8CMQWXO1LYDH2H3BU05VRTKMJHDZEOKT2',
    'method': 'post',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-length': post_data.length,
        'appSrv': 'c18.ykdanmu.m6.tudou.com-app_admin',
        'Cookie': '__ysuid=1456300441137UoZ; __ali=14563591545799OK; advideo={"adv205987_3": 2}; __aliCount=1; runIcon_day=yes; ykss=39bbce56335a583321ed4d1d; _l_lgi=61051014; u=tiantieming; xreferrer=https://www.baidu.com/link?url=8BjTq299hERxxUuszaIjlMD_wqoRvwTQLMgWemRP31LuC8QZmu8Wi6lk_ejcWqv-YMhbK2vy4XZti6mOQ4Ui5F57KSWCoUjUTymO0cTnqoW1Has1E83w-U2ECF0oqZCaLLbbB9IRQIG7glvIP9JdZa&wd=&eqid=8bfb39a10000d9d40000000256cec1b2; premium_cps_vid=XMTMyMzkyNzU5Ng%3D%3D; P_F=1; logCookieKey=invalid; P_T=1456398166; yktk=1%7C1456388921%7C15%7CaWQ6NjEwNTEwMTQsbm46dGlhbnRpZW1pbmcsdmlwOnRydWUseXRpZDozMzY3OTk3NTksdGlkOjA%3D%7Ce47c1068d49087d46eb84dee7f9d715b%7Cb9d978e8e8843c47ba5a448b427185ab5bfda0fc%7C1%7C1%7C1; rpvid=1456390610058pO5pzq-1456391432181'
    }
};
var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log('Response: ' + chunk);
    });
}).on('error', function(error) {
    console.log(error);
});;
post_req.write(post_data);
post_req.end();