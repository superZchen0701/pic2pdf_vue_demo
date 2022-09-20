import axios from 'axios';
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据
import { CONFIG } from './config';
import { checkResStatus } from './utils';
import { Message } from 'element-ui';

const instance = axios.create({
  baseURL: CONFIG.baseURL,
  // 跨域请求时是否需要使用凭证
  withCredentials: true,
  // 超时时间
  timeout: 30000,
  // 在向服务器发送请求前，序列化请求数据
  transformRequest: [(data) => {
    return data;
  }],
  // 在传递给 then/catch 前，修改响应数据为json数据
  transformResponse: [(data) => {
    if (typeof data === 'string' && data.startsWith('{')) {
      data = JSON.parse(data);
    }
    return data;
  }],
});

// 请求拦截器
instance.interceptors.request.use((config) => {
    // 在发送请求之前做处理
    config.headers = Object.assign(config.method === 'get' ? {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
    } : {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }, config.headers);
    if (config.method === 'post') {
        const contentType = config.headers['Content-Type'];
        // 根据Content-Type转换data格式
        if (contentType) {
            // 类型 'multipart/form-data;'
            if (contentType.includes('multipart')) {
                // config.data = data;
            } else if (contentType.includes('json')) {
                // 类型 'application/json;'
                // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
                config.data = JSON.stringify(config.data);
            } else {
                // 类型 'application/x-www-form-urlencoded;'
                // 服务器收到的raw body(原始数据) name=nowThen&age=18
                config.data = Qs.stringify(config.data);
            }
        }
    }
    return Promise.resolve(config);
}, (error) => {
    // 请求错误
    return Promise.reject(error);
})

// 响应拦截器
instance.interceptors.response.use((response) => {
    return Promise.resolve(checkResStatus(response));
}, (error) => {
    // 响应错误
    if (error.response) {
        return Promise.reject(checkResStatus(error.response));
    }
    if (error.code == 'ECONNABORTED' &&
        error.message.indexOf('timeout') != -1
    ) {
        return Promise.reject({ msg: '请求超时' });
    }
    return Promise.reject({ msg: '请求处理失败' });
})

const service = async function (opt) {
    const options = Object.assign({
        method: 'get',
        // 是否统一处理接口失败(提示)
        ifHandleError: true,
    }, opt);
    try {
        const res = await instance(options);
        if (+res.code !== 0 && options.ifHandleError) {
            // 自定义参数，是否允许全局提示错误信息
            Message.error(res.msg || '请求处理失败');
        }
        return res;
    } catch (err) {
        if (options.ifHandleError) {
            // 自定义参数，是否允许全局提示错误信息
            Message.error(err.msg || '请求处理失败');
        }
        return err;
    }
};

export default service;