process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) { 
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write('data: ' + chunk); 
});
process.stdin.on('end', function () {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);	
	process.stdout.write('end');
});