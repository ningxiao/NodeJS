'use strict'
const co = require('co');
const chalk = require('chalk');
const prompt = require('co-prompt');
module.exports = () => {
    co(function*() {
        // 处理用户输入
        let tplName = yield prompt('用户名: ');
        let projectName = yield prompt('项目名称: ');
        console.log(chalk.white('\n 开始创建文件...'));
        setTimeout(() => {
            console.log(chalk.green('\n √ 创建项目完毕!'));
            console.log(`\n cd ${projectName} && npm install \n`);
            process.exit();
        }, 1000);

    });
};