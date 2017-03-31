var mysqldb = require("../db/mysqldb");
var assert = require('assert');
function store(done) {
	mysqldb.store(function(error){
		if(error){
			done(error);
			return 
		}
		done();
	});
} 
describe('add()', function() {
	var tests = [{args:[1,2],expected:3},{args:[1,2,3],expected:6},{args:[1,2,3,4],expected:10}];
	// it('数据库添加', function() {
	// 	tests.forEach(function(test) {
	// 		mysqldb.add(test);
	// 	});
	// });
	it('数据库列表', function() {
		console.log(mysqldb.list());
	});
	// it('数据库删除', function() {
	// 	mysqldb.del(0);
	// });
	// it('数据库列表', function() {
	// 	console.log(mysqldb.list());
	// });
	// it('数据库更新', function() {
	// 	mysqldb.update(0,{args:[1,2],expected:3});
	// });
	// it('数据库列表', function() {
	// 	console.log(mysqldb.list());
	// });
	// it('数据库清空', function() {
	// 	mysqldb.remove();
	// });
	// it('数据库持久化', function(done) {
	// 	store(done);
	// });
});