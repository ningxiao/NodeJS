"use strict";
const os = require('os');
const cluster = require('cluster');
const httpServer = require('./httpServer');
if (cluster.isMaster) {
	function messagenotice(mes) {
		console.log(mes);
	};
	for (let i = 0, cpus = os.cpus().length; i < cpus; i++) {
		cluster.fork();
	};
	Object.keys(cluster.workers).forEach(function(id) {
		cluster.workers[id].on('message', messagenotice);
	});
	cluster.on('exit', function(worker, code, signal) {
		console.log('[master] ' + 'exit worker' + worker.id + ' died');
	});
	Object.keys(cluster.workers).forEach(function(id) {
		cluster.workers[id].send({
			'head': 'set action',
			'body': {"name":"宁肖"}
		});
	});
} else {
	httpServer.listen(80);
}