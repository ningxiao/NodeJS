"use strict";
var list = [1,2,3,4,5,6,7,8];
const name = 'nxiao';
// let不会出现变量提升 只在当前域存在
for(let i = 0,len = list.length;i < len; i++){
	list[i] = function () {
	    console.log(i);
	};
}
list[6]();// 如果i声明为var i为最后循环结构 let为当前
console.log(name);


var tmp = 123;
if (true) {//块级作用域 只有离最近的使用优先级最高 
	try{ 
	    tmp = 'xxx'; // 没有声明报出异常
	}catch(err){ 
	  	console.log("块级作用域没有声明");
	} 
    let tmp = 'abc';
    console.log(tmp);
}
console.log(tmp);

function f1() {//ES6的块级作用域
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 因为已经跳出if作用域块了
}