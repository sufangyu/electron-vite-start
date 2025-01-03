/**
|--------------------------------------------------
| @hasOwnProperty
| 返回一个布尔值
| 指示对象自身属性中是否具有指定的属性（也就是是否有指定的键）
|
| @trim
| 返回的是一个新的字符串
| 从一个字符串的两端删除空白字符 在这个上下文中的空白字符是所有的空白字符 (space, tab, no-break space 等) 以及所有行终止符字符（如 LF，CR）
|--------------------------------------------------
*/

const Query = (options, dataSource) => {
  // eslint-disable-next-line prefer-const
  let { pageNum: page, pageSize: size, ...other } = options;
  page = page || 1;
  size = size || 10;

  // // eslint-disable-next-line no-restricted-syntax
  // for (const key in other) {
  //   if ({}.hasOwnProperty.call(other, key)) {
  //     // eslint-disable-next-line no-param-reassign
  //     dataSource = dataSource.filter((item) => {
  //       if ({}.hasOwnProperty.call(item, key)) {
  //         return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1;
  //       }
  //       return true;
  //     });
  //   }
  // }

  // 支持 title 搜索
  if (other.title) {
    dataSource = dataSource.filter((item) => {
      return item.title.includes(other.title);
    });
  }

  return { page, size, dataSource };
};

function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

module.exports = { Query, generateRandomToken };
