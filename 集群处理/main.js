var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
  require('os').cpus().forEach(function() {
    cluster.fork();
  });
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
  cluster.on('listening', function(worker, address) {
    console.log("A worker with #" + worker.id + " is now connected to " + address.address + ":" + address.port);
  });
  var reqCount = 0;
  Object.keys(cluster.workers).forEach(function(id) {
    cluster.workers[id].on('message', function(msg) {
      if (msg.info && msg.info == 'ReqServMaster') {
        reqCount += 1;
      }
    });
  });
  setInterval(function() {
    console.log("Number of request served = ", reqCount);
  }, 1000);

} else {
  require('http').Server(function(req, res) {
    res.writeHead(200);
    res.end("Hello from Cluster!");
    process.send({
      info: 'ReqServMaster'
    });
  }).listen(8000);
}