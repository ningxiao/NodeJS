"use strict";
const http = require('http');
const crypto = require('crypto');
const querystring = require('querystring');
const md_key = "woeo;;3003*(*^&*(2292220003;!!@#lsdlfsldfkl[]]]===-sdfkl*";
const options = {
	'userid': 13123352490181888, //  135601920040022851
	'guid': '12b53027-117a-49a0-9604-ffbcba4390c5',
	'vid': '2274154',
	'mac': '{6EB90B56-0AA3-867F-F8C1-A9334BDEBDA7}',
	'time': 1422001838,
	'sign': null,
	'isauth': 1
};

function sign(data) {
	let md5sum = crypto.createHash('md5');
	//md5sum.update(data.userid + data.guid + data.mac + data.time + md_key);
	md5sum.update(data.userid + data.vid + data.mac + data.time + md_key);
	return md5sum.digest('hex').toUpperCase();
};
options.sign = sign(options);
const post_options = {
	'host': 'vipssl.baofeng.com',
	'port': '80',
	//'path': '/drm/client_request_by_guid?' + querystring.stringify(options),
	'path': '/drm/client_request_by_vid?' + querystring.stringify(options),
	'method': 'GET'
};
let post_req = http.request(post_options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		console.log('Response: ' + chunk);
	});
	res.on('end', function() {
		console.log('end: ');
	});
	res.on('error', function(error) {
		console.log('error: ' + error);
	});
}).on('error', function(error) {
	console.log(error);
});
post_req.end();