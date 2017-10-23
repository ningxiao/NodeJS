/**
 * local：本地开发环境 修改worker.js文件自动重启工作进程
 * unittest：单元测试环境
 * production：线上生产环境
 * kill -s USR2 30057 平滑重启
 *
 *             ┌────────┐
 *             │ master │
 *            /└────────┘\
 *           /            \
 *          /              \
 *         /                \
 *        /                  \
 *       /                    \
 *     ┌───────┐         ┌────────┐
 *     │ agent │ ------- │ worker │
 *     └───────┘         └────────┘
 * 
 */
const os = require('os');
const path = require('path');
const cluster = require('cluster');
const cp = require('child_process');
const config = require('./config');
const cpus = config.workers || os.cpus().length;
//agent进程实现类似redis功能并且监听文件改变修改重启工作进程
const agent = cp.fork(path.join(__dirname, "agent.js"), ['--port', config.redis.port], {
    env: {
        NX_SERVER_ENV: config.env
    }
});
//超时处理存储
const timeouts = [];
/**
 * 创建webserver工作进程
 */
const createWorker = (sum) => {
    cluster.setupMaster({
        exec: path.join(__dirname, 'worker.js'),
        args: [config.port, config.redis.port],
        silent: false
    });
    for (let i = 0; i < sum; i++) {
        cluster.fork({
            NX_SERVER_ENV: config.env
        }).send({
            'head': 'set action',
            'body': '开始启动'
        });
    };
};
/**
 * agent进程开启完成开始创建工作进程
 */
const forkWorkers = () => {
    /**
     * 创建子进程成功
     */
    cluster.on('fork', (worker) => {
        console.log('[master] ' + 'fork: worker' + worker.id);
        worker.disableRefork = true;
        worker.on('message', (msg) => {
            switch (msg.head) {
                case 'client-end-success':
                    break;
                default:
                    break;
            };
            console.log(msg);
        });
    });
    /**
     * 连接结束
     */
    cluster.on('disconnect', (worker) => {
        console.log('[master] ' + 'disconnect: worker' + worker.id);
        if (timeouts[worker.id]) {
            clearTimeout(timeouts[worker.id]);
        };
    });
    /**
     * 进程结束
     */
    cluster.on('exit', (worker, code, signal) => {
        console.log('[master] ' + 'exit worker' + worker.id + ' died', code, signal);
        worker.removeAllListeners();
        if (worker.disableRefork) { //由于自身原因挂掉一个工作进程启动一个工作进程替补
            createWorker(1);
        };
    });
    /**
     * 监听http连接请求
     */
    cluster.on('listening', (worker, address) => {
        console.log('[master] ' + 'listening: worker ' + worker.process.pid + ', Address: ' + address.address + ":" + address.port);
    });
    createWorker(cpus);
};
/**
 * 用于处理已经存在的http连接强制时间超出断开连接
 * @param  {} worker
 */
const toutworker = (worker) => {
    return () => {
        console.log('[master]', 'worker:', "连接超时手动关闭");
        worker.process.kill('SIGTERM'); //kill模式会全部断开改工作进程的连接
    };
};
/**
 * 文件更新或者手动启动平滑更新
 */
const reload = () => {
    let id, worker;
    console.log("************************重启工作进程************************");
    for (let id in cluster.workers) {
        worker = cluster.workers[id];
        worker.disableRefork = false;
        worker.disconnect(); //不在接收新连接并且处理完成已经存在的连接触发disconnect事件
        timeouts[id] = setTimeout(toutworker(worker), config.processKillTimeout); //防止出现超长连接没有断开进行强制断开
    };
    createWorker(cpus);
};
/**
 * 用户强制退出master进程不需要重启工作进程
 * @param  {} signal
 */
const onSignal = (signal) => {
    let id, worker;
    console.log('[master]', signal + '-退出');
    for (id in cluster.workers) {
        worker = cluster.workers[id];
        worker.disableRefork = false;
        worker.process.kill('SIGTERM');
    };
    setTimeout(() => {
        process.exit(0);
    }, 100);
};
//agent进程初始化完成
agent.on('message', (msg) => {
    switch (msg.head) {
        case "agent-init-success":
            console.log('[master]', 'agent:', "initsuccess");
            forkWorkers();
            break;
        case "agent-worker-update": //agent发送命令重启工作进程
            reload();
            break;
        default:
            break;
    };
});
agent.on('error', (err) => {
    console.log('[master]', 'agent:', "error:", err.toString());
});
agent.once('exit', (code, signal) => {
    console.log('[master]', 'agent:', "exit:", code, signal);
});
// kill(2) Ctrl-C
process.once('SIGINT', onSignal.bind(this, 'SIGINT'));
// kill(15) default   监听SIGTERM信号
process.once('SIGTERM', onSignal.bind(this, 'SIGTERM'));
// kill(3) Ctrl-\     监听SIGQUIT信号
process.once('SIGQUIT', onSignal.bind(this, 'SIGQUIT'));
// 重启事件
process.on(config.reloadSignal, () => {
    console.log("************************SIGUSR2************************");
    reload();
});
// 监听exit事件
process.once('exit', () => {
    console.log('[master]', 'exit-退出');
});