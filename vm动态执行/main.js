var vm = require('vm');
var fs = require('fs');
var code,script;
code = fs.readFileSync('example.js');
script = vm.createScript(code.toString());
//script.runInNewContext({output:"Kick Ass"});
script.runInNewContext({"console":console,"output":"Kick Ass"});