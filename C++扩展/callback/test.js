var addon = require('./build/Release/callback');
addon.exports("callbackc++",function(type,msg){
  console.log(type,msg);
});