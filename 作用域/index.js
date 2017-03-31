var ActionSupport = require('./model/ActionSupport.js');
var test = new ActionSupport();
var name = "nx";
this.result = "测试作用域";
test.init(name);
test.execute.call(this);