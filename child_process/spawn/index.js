'use strict';
const cp = require('child_process');
const child = cp.spawn('node', ['child.js']);
const data = [];
child.stdout.on('data', (chunk) => {
    data.push(chunk);
});
child.on('exit', () => {
    console.log(data.join(''));
    process.exit(0);
});
// let i = 1;
// setInterval(()=>{
//     console.log(`x${i++}`)
// },100)