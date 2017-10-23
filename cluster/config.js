module.exports = {
    env: (() => {
        if (process.env.NX_SERVER_ENV === 'local' || process.env.NODE_ENV === 'development') {
            return "local";
        };
        return "local";
    })(),
    port: 80,
    workers: 2,
    processKillTimeout: 10 * 1000,
    reloadSignal: 'SIGUSR2',
    redis: {
        host: '127.0.0.1',
        port: 8888
    }
};