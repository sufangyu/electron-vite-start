// 参考: https://github.com/ecstAsy/Taro-Mock/blob/master/mock/index.js
const fs = require('fs');
const { join } = require('path');
const delay = require('mocker-api/lib/delay');
const { Query } = require('./utils');
const ListData = require('./list');
const userModule = require('./modules/user');
const uploadModule = require('./modules/upload');

const proxy = {
  _proxy: {
    header: {
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'
    }
  },

  'GET /api/list': (req, res) => {
    const { query } = req;
    console.log('GET /api/list', query);
    const { page, size, dataSource } = Query(query, ListData.list);

    res.status('200').json({
      success: true,
      message: '请求成功',
      data: {
        list: dataSource.slice((page - 1) * size, page * size),
        page: Number(page),
        size: Number(size),
        pages: Math.ceil(dataSource.length / size),
        total: dataSource.length
      }
    });
  },

  'GET /api/search/:id': (req, res) => {
    const { id } = req.params;
    const { dataSource } = Query({}, ListData.list);
    const result = dataSource.filter((it) => it.id === Number(id));

    res.status('200').json({
      success: true,
      message: '请求成功',
      data: result
    });
  },

  'POST /api/post': (req, res) => {
    const { body } = req;
    res.status('200').json({
      success: true,
      message: '请求成功',
      data: {
        name: body.name,
        age: body.age
      }
    });
  },

  'PUT /api/put': (req, res) => {
    const { body } = req;
    res.status('200').json({
      success: true,
      message: `更新${body.id}信息成功`,
      data: {
        id: body.id
      }
    });
  },

  'DELETE /api/delete/:id': (req, res) => {
    const { id } = req.params;
    res.status('200').json({
      success: true,
      message: `ID:${id}的用户删除成功`
    });
  },

  'POST /api/base/:id': (req, res) => {
    const { params, body } = req;
    res.status('200').json({
      success: true,
      message: `请求响应成功`,
      data: {
        id: params.id ?? '',
        course: body.course ?? '',
        hobby: body.hobby ?? []
      }
    });
  },

  // 响应结果
  'GET /api/response/:result': (req, res) => {
    const { result } = req.params;
    res.status(200).json({
      success: result === 'success' ? true : false,
      message: `响应结果是: ${result}`
    });
  },

  // 状态码
  'GET /api/status/:status': (req, res) => {
    const { status } = req.params;
    res.setHeader('Content-Type', 'application/json');
    res.status(status).send({
      success: true,
      message: `状态码是: ${status}`
    });
  },

  // 模拟文件下载接口
  'GET /download/file.pdf': (_req, res) => {
    const filePath = join(__dirname, 'file.pdf');
    const filename = '接口返回的文件名.pdf';
    const file = fs.readFileSync(filePath);

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename));
    res.setHeader('Content-Type', 'application/pdf'); // 返回 Blob 格式的文件
    res.send(file);
  },
  'GET /download/file-json': (_req, res) => {
    const filePath = join(__dirname, 'file.zip');
    const filename = '接口返回的文件名.pdf';

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename));
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(filePath);
  },

  // 用户模块
  ...userModule,

  // 上传模块
  ...uploadModule
};

// 使用delay方法可以延迟返回数据
module.exports = delay(proxy, 500);
