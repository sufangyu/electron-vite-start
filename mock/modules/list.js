const ListData = require('../list');
const { Query } = require('../utils');

const listModule = {
  'GET /api/list': (req, res) => {
    const { query } = req;
    const { page, size, dataSource } = Query(query, ListData.list);
    console.log('GET /api/list', page, size);

    if (Number(page) === 5) {
      res.status('200').json({
        success: true,
        message: '请求成功',
        data: {
          list: [],
          page: Number(page),
          size: Number(size),
          pages: Math.ceil(dataSource.length / size),
          total: dataSource.length
        }
      });
    } else {
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
    }
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
  }
};

module.exports = listModule;
