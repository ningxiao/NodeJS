"use strict";
let crypto = require('crypto');
class aes {
    constructor(cryptkey, vi) {
        this.cryptkey = cryptkey;
        this.vi = vi;
    };
    encoded(uid) {
        let cipher = crypto.createCipheriv('AES-128-CBC', this.cryptkey, this.vi);
        let encoded = cipher.update(uid, 'utf8', 'hex');
        encoded += cipher.final('hex');
        return encoded;
    };
    decode(token) {
        let decipher = crypto.createDecipheriv('AES-128-CBC', this.cryptkey, this.vi);
        let decode = decipher.update(token, 'hex', 'utf8');
        decode += decipher.final('utf8');
        return decode;
    };
}
let aesoc = new aes(new Buffer('xnjycyh3761T3d7f', 'utf-8'), new Buffer('00000000000000000000000000000000', 'hex').toString('utf-8'));
let enkey = aesoc.encoded('宁肖');
let dekey = aesoc.decode(enkey);
console.log(enkey,dekey);