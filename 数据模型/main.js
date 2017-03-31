var events = require('events');
var assert = require('assert');
var dbFindA,dbFindB,userModel,results = {};
dbFindA = function (name, callback) {
    setTimeout(function () {
        callback(name.length * 1000);
    }, 1000);
};
dbFindB = function (id, callback) {
    setTimeout(function () {
        callback(parseInt(id) + 1000);
    }, 2000);
};
function Model (name, id) {
    var self = this,count = 2;
    function roll () {
        if (--count === 0) {
            setTimeout(function () {
                self.emit('end');
            }, 1000);            
        }
    }
    dbFindA(name, function (result) {
        self.emit('name', result);
        roll();
    });
    dbFindB(id, function (result) {
        self.emit('id', result);
        roll();
    });
}
Model.prototype = Object.create(events.EventEmitter.prototype);
userModel = new Model('lili', 10);
userModel.on('name', function (result) { 
    results['name'] = result;
    console.log('1 -- results: ', results);
    assert.ok(typeof result === 'number');
    assert.strictEqual(result, 4000);
}).on('id', function (result) {
    results['id'] = result;
    console.log('2 -- results: ', results);
    assert.ok(typeof result === 'number');
    assert.strictEqual(result, 1010);
}).on('end', function () {
    console.log('3 -- results: ', results);
    assert.deepEqual(results, {name: 4000,id: 1010});
});