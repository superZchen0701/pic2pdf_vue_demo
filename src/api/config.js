const config = {
    // 开发环境相关配置(也可以通过配置.env.[mode]文件实现)
    development: {
        baseURL: 'http://localhost:3000/',
    },
    // 测试环境相关配置
    test: {
        baseURL: '//test.xxx/api/',
    },
    // 生产环境相关配置
    production: {
        baseURL: '//xxx/api/',
    },
};
const isProdEnv = location.hostname === 'xxx';
const isTestEnv = location.hostname === 'test.xxx';

let env = 'development';
if (isProdEnv) {
    env = 'production';
} else if (isTestEnv) {
    env = 'test';
}

export const ENV = env;
export const CONFIG = config[env];
