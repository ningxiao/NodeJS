var crypto = require('crypto');
var utils = require('./utils');
var config = require('./config');
function EncodedToken(cryptkey,vi){
	var uid,cipher,encoded;
	uid = utils.getuid();
	cipher = crypto.createCipheriv(config.GATEWAYTYPE,cryptkey,vi);
	encoded  = cipher.update(uid, 'utf8', 'hex');
	encoded += cipher.final('hex');
	return {"uid":uid,"key":encoded};	
}
function DecodeToken(token,cryptkey,vi){
	var decipher,decode;
	decipher = crypto.createDecipheriv(config.GATEWAYTYPE,cryptkey,vi);
	decode = decipher.update(token, 'hex', 'utf8');
	decode += decipher.final('utf8');
	return decode;
}
module.exports = {"EncToken":EncodedToken,"DecToken":DecodeToken};