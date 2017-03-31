function Tree(x){
	this.value = x;
}
Tree.prototype = {
	children:[],
	addChild:function(x){
		this.children.push(x);
	}
}
var left = new Tree(2);
left.addChild(1);
left.addChild(3);
var right = new Tree(2);
left.addChild(1);
left.addChild(3);