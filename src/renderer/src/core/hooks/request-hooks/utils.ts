/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 处理数据前后空格
 *
 * @template T
 * @param {T} value 参数数据
 * @return {*}  {T}
 */
export const trimValue = <T = any>(value: T): T => {
  if (typeof value === 'string') {
    return value.trim() as unknown as T;
  } else if (typeof value === 'object' && value !== null) {
    for (const key in value) {
      value[key] = trimValue(value[key]);
    }
    return value;
  }

  return value;
};

/**
 * 更新页面 URL
 * @param {Record<string, any>} params 参数
 * @param {boolean} [isReset = false] 是否重置操作
 */
export const updatePageUrl = (params: Record<string, any>, isReset = false) => {
  const query = Object.assign({}, params);

  // 增加时间戳参数, 避免调用 router.replace 路由重复时报 Navigation Duplicated 错误
  query.t = +new Date();

  // 中文编码
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (typeof value === 'object') {
      query[key] = encodeURIComponent(JSON.stringify(value));
    } else {
      query[key] = value ? encodeURIComponent(value) : '';
    }
  });

  const [pageUrl] = window.location.href.split('?');
  if (isReset) {
    // 处理 URL 参数
    window.history.pushState({}, '', `${pageUrl}`);
  } else {
    // 处理 URL 参数
    const searchParams = new URLSearchParams('');
    Object.entries(query).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    const search = searchParams.toString();
    window.history.pushState({}, '', `${pageUrl}?${search}`);
  }
};
