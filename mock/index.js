// 参考: https://github.com/ecstAsy/Taro-Mock/blob/master/mock/index.js
const delay = require('mocker-api/lib/delay');

const downloadModule = require('./modules/download');
const listModule = require('./modules/list');
const requestModule = require('./modules/request');
const staticModule = require('./modules/static');
const uploadModule = require('./modules/upload');
const userModule = require('./modules/user');

const proxy = {
  _proxy: {
    header: {
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'
    }
  },

  // 静态文件
  ...staticModule,

  // 请求模块
  ...requestModule,

  // 下载模块
  ...downloadModule,

  // 用户模块
  ...userModule,

  // 列表模块
  ...listModule,

  // 上传模块
  ...uploadModule
};

// 使用delay方法可以延迟返回数据
module.exports = delay(proxy, 500);
