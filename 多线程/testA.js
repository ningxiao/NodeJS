var os = require("os");
var cluster = require('cluster');
var cpus = os.cpus().length,worker;
function fibo (n) {  
    return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;  
}  
console.time(cpus+' cluster');  
if (cluster.isMaster) {  
    for (var i = 0; i < cpus; i++) {  
        worker = cluster.fork();  
        worker.send('[master] ' + 'hi worker' + worker.id);
    }  
    i = cpus;  
    cluster.on('exit', function(worker, code, signal) {  
        if(!--i){  
            console.timeEnd(cpus+' cluster');  
            process.exit(0);  
        }  
    });  
} else {  
    console.log(fibo (40));  
    process.exit(0);  
}  