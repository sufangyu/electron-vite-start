const { generateRandomToken } = require('../utils');

const users = [
  { id: 1, username: 'zsf', password: '111', email: 'zsf@xxx.com' },
  { id: 2, username: 'ls', password: '222', email: 'ls@yyy.com' }
];
// 已登录的 token 信息
let redisToken = [];

const checkTokenMiddleware = (req, res) => {
  const { token } = req.headers;
  const redisItem = redisToken.find((it) => it.accessToken === token);
  console.log('判断是否登录', token, redisItem, redisToken);
  const isLogged = !!redisItem;

  // 未登录
  if (!isLogged) {
    res.status('401').json({
      success: false,
      message: '未登录',
      data: null
    });
    return false;
  }

  // token 已过期
  const difference = Math.abs(+new Date() - redisItem.created);
  const isExpired = difference > 1000 * 60 * 0.5;
  console.log('登录已过期', isExpired);

  if (isExpired) {
    res.status('403').json({
      success: true,
      message: '登录已过期',
      data: null
    });
    return false;
  }

  return true;
};

const userModule = {
  'POST /api/user/login': (req, res) => {
    const { body } = req;
    console.log('POSY /api/login', body);

    const user = users.find(
      (item) => item.username === body.username && item.password === body.password
    );

    let accessToken = '';
    let refreshToken = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = user ?? {};
    const timestamp = +new Date();

    if (user) {
      accessToken = generateRandomToken(10);
      refreshToken = generateRandomToken(10);
      const index = redisToken.findIndex((it) => it.id === user.id);
      const newTokenItem = {
        ...userInfo,
        accessToken,
        refreshToken,
        created: timestamp
      };

      if (index !== -1) {
        redisToken[index] = newTokenItem;
      } else {
        redisToken.push(newTokenItem);
      }

      console.log('redisToken =>>', redisToken);
    }

    res.status('200').json({
      success: !!user,
      message: user ? '请求成功' : '用户名或者密码错误',
      data: user
        ? {
            userInfo,
            accessToken,
            refreshToken
          }
        : null
    });
  },

  'POST /api/user/logout': (req, res) => {
    const { token } = req.headers;
    if (!token) {
      res.status('200').json({
        success: false,
        message: '未登录',
        data: null
      });
      return;
    }

    redisToken = redisToken.filter((it) => it.accessToken !== token);
    console.log('redisToken =>>', redisToken);

    res.status('200').json({
      success: true,
      message: '退出成功',
      data: null
    });
  },

  'GET /api/user/:id': (req, res) => {
    const { id } = req.params;
    const checkResult = checkTokenMiddleware(req, res);
    const user = users.find((it) => it.id === Number(id));

    if (!checkResult) {
      return;
    }

    res.status('200').json({
      success: true,
      message: '获取成功',
      data: {
        userInfo: user
      }
    });
  },

  'GET /api/user-detail/:id': (req, res) => {
    const { id } = req.params;
    const checkResult = checkTokenMiddleware(req, res);
    const user = users.find((it) => it.id === Number(id));

    if (!checkResult) {
      return;
    }

    res.status('200').json({
      success: true,
      message: '获取成功',
      data: {
        userInfo: user
      }
    });
  },

  // 刷新 TOKEN
  'GET /api/token/refresh': (req, res) => {
    let refreshToken = req.headers['refresh-token'];
    const user = redisToken.find((it) => it.refreshToken === refreshToken);

    if (!user) {
      res.status('200').json({
        success: false,
        message: '未登录',
        data: null
      });
      return;
    }

    const accessToken = generateRandomToken(10);
    refreshToken = generateRandomToken(10);

    // 更新 redisToken
    const timestamp = +new Date();
    const index = redisToken.findIndex((it) => it.refreshToken === user.refreshToken);
    const newTokenItem = {
      ...redisToken[index],
      accessToken,
      refreshToken,
      created: timestamp
    };

    if (index !== -1) {
      redisToken[index] = newTokenItem;
    } else {
      redisToken.push(newTokenItem);
    }

    console.log('刷新Token后redisToken =>>', redisToken);

    res.status('200').json({
      success: true,
      message: '刷新成功',
      data: {
        accessToken,
        refreshToken
      }
    });
  }
};

module.exports = userModule;
