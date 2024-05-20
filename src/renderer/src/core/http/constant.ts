/**
 * 请求 API_BASE_URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE;

/**
 * token 请求头
 */
export const TOKEN_HEADER_KEY = 'token';

/**
 * refresh-token 请求头
 */
export const REFRESH_TOKEN_HEADER_KEY = 'refresh-token';

/**
 * 跳过取消请求检测的请求头
 */
export const SKIP_CANCEL_HEADER_KEY = 'Skip-Cancel';

/**
 * 不同方法对应 loading 提示文案
 */
export const LOADING_MESSAGE_MAP: Record<string, string> = {
  GET: '加载中...',
  POST: '提交中...',
  PUT: '提交中...',
  PATCH: '更新中...',
  DELETE: '删除中...'
};

/**
 * HTTP 状态码文案描述
 */
export const MESSAGE_MAP: Record<string, string> = {
  400: '错误请求',
  401: '会话过期，请重新登录',
  403: '拒绝访问',
  404: '请求错误，未找到该资源',
  405: '请求方法未允许',
  408: '请求超时',
  500: '服务器端出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'HTTP版本不支持该请求'
};
