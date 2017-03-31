var name;
function ActionSupport(){
}
ActionSupport.prototype.init = function(result){
	name = result;
}
ActionSupport.prototype.execute = function(){
	console.log("execute",this.result,name);
}
module.exports = ActionSupport;