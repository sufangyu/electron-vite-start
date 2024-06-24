const requestModule = {
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
  }
};

module.exports = requestModule;
