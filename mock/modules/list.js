const ListData = require('../list');
const { Query } = require('../utils');

const listModule = {
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
  }
};

module.exports = listModule;
