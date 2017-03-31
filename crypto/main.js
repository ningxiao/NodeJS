const crypto = require('crypto');
const encrypted = 'RwH5I4T8flO6j4rnXCv0fQ';
const decipher = crypto.createDecipher('des-ecb', '95C28A98');
let decrypted = '';
decipher.on('readable', () => {
	let data = decipher.read();
	if (data){
		decrypted += data.toString('utf8');
	};
});
decipher.on('end', () => {
	console.log(decrypted);
});
decipher.write(encrypted, 'base64');
decipher.end();