import Vue from 'vue';
import service from './http';
import apiUrl from './apiUrl';

let api = {};

Object.entries(apiUrl).forEach((item) => {
    api[item[0]] = function (options = {}) {
    return service(Object.assign({
        url: item[1].url,
    }, options));
  }
});

// 将services挂载到vue的原型上
// 业务中引用的方法：this.$api.接口名（驼峰）
Object.defineProperty(Vue.prototype, '$api', {
  value: api,
});

export default api;
