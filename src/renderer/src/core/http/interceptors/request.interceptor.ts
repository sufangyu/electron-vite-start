import { AxiosHeaders, AxiosRequestHeaders, Canceler, InternalAxiosRequestConfig } from 'axios';
import { HttpRequestConfig } from '../types';
import helper, { isEmptyObject } from '../helper';

// 缓存请求对象, 用于取消重复请求
const cacheRequestPromise: Record<string, Canceler | undefined> = {};

// 不同方法对应 loading 提示文案
const LOADING_MESSAGE_MAP: Record<string, string> = {
  POST: '提交中...',
  PUT: '提交中...',
  DELETE: '删除中...'
};

/**
 * 处理 loading 文案、请求头
 *
 * @export
 * @param {HttpRequestConfig} config
 * @return {*}  {InternalAxiosRequestConfig}
 */
export function handleRequestDefault(config: HttpRequestConfig): InternalAxiosRequestConfig {
  const METHOD = config.method!.toLocaleUpperCase();

  // loading 遮罩层提示文案
  if (config.loading) {
    LOADING_MESSAGE_MAP[METHOD] && (config.loadingMessage = LOADING_MESSAGE_MAP[METHOD]);
    const message = config.loadingMessage;
    helper.showFullScreenLoading(message);
  }

  // 请求头
  const headers = _getHeaders(config!);
  const token = 'Bear token';
  token && headers.set('Authorization', token);

  const resultConfig: InternalAxiosRequestConfig = {
    ...config,
    headers
  };
  return resultConfig;
}

/**
 * 处理请求 url
 *
 * - 非 http、https: 按照服务拼接完整 url
 * - http、https: 直接使用
 *
 * @export
 * @param {HttpRequestConfig} config
 * @return {*}  {InternalAxiosRequestConfig}
 */
export function handleRequestConfigUrl(config: HttpRequestConfig): InternalAxiosRequestConfig {
  // 处理完整 URL. 非 http, https 才处理
  const isExternal = /^(https?:)/.test(config.url!);
  const API_BASE = import.meta.env.VITE_API_BASE;
  if (!isExternal && API_BASE.startsWith('http')) {
    const API_BASE = import.meta.env.VITE_API_BASE;
    config.url = `${API_BASE}${config.url}`;
  }

  const headers = _getHeaders(config!);
  const resultConfig: InternalAxiosRequestConfig = {
    ...config,
    headers
  };
  return resultConfig;
}

/**
 * 请求拦截器 - 处理重复请求
 *
 * 如后续发起请求已存在并且再等待响应中时, 取消正在等待的相同请求
 *
 * @export
 * @param {HttpRequestConfig} config
 * @return {*}  {InternalAxiosRequestConfig}
 */
export function handleRequestDuplicate(config: HttpRequestConfig): InternalAxiosRequestConfig {
  const { method, url, isCancelDuplicateWithArgs } = config;
  const METHOD = method!.toLocaleUpperCase();
  let cacheRequestKey = `${METHOD!}__${url}`;
  const dataTemp = { ...config.data };
  const paramsTemp = { ...config.params };

  // 唯一缓存 Key 排除的参数
  ['_', 't'].forEach((key) => {
    delete dataTemp[key];
    delete paramsTemp[key];
  });

  // 带参数的缓存 key
  if (isCancelDuplicateWithArgs) {
    !isEmptyObject(dataTemp) && (cacheRequestKey += `__${JSON.stringify(dataTemp)}`);
    !isEmptyObject(paramsTemp) && (cacheRequestKey += `__${JSON.stringify(paramsTemp)}`);
  }

  // 取消重复请求
  if (cacheRequestPromise[cacheRequestKey]) {
    cacheRequestPromise[cacheRequestKey]?.('请求已取消');
  }
  cacheRequestPromise[cacheRequestKey] = config.canceler;

  const headers = _getHeaders(config!);
  const resultConfig: InternalAxiosRequestConfig = {
    ...config,
    headers
  };
  return resultConfig;
}

/**
 * 获取请求头
 *
 * @param {HttpRequestConfig} config
 * @return {*}  {AxiosRequestHeaders}
 */
const _getHeaders = (config: HttpRequestConfig): AxiosRequestHeaders => {
  // FIX: Type '{}' is not assignable to type 'AxiosRequestHeaders'
  // https://github.com/axios/axios/issues/5573#issuecomment-1644862647
  const headers: AxiosRequestHeaders = new AxiosHeaders();
  Object.entries(config.headers ?? {}).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return headers;
};
